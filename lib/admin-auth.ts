/**
 * Server-only admin auth: signed httpOnly cookie. Do not import in client code.
 */
import "server-only";

import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "vega-admin-session";
const PAYLOAD = "authenticated";

/** Admin password required to access /admin. Override with ADMIN_PASSWORD env if needed. */
const DEFAULT_ADMIN_PASSWORD = "VegaFinancialTheBest";

function getSecret(): string {
  const raw = process.env.ADMIN_PASSWORD;
  const fromEnv = typeof raw === "string" ? raw.trim() : "";
  if (fromEnv && fromEnv.length >= 8) return fromEnv;
  return DEFAULT_ADMIN_PASSWORD;
}

function sign(secret: string, value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function getAdminAuth(): { authenticated: boolean } {
  try {
    const secret = getSecret();
    const cookieStore = cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;
    if (!raw) return { authenticated: false };
    const [payload, sig] = raw.split(".");
    if (payload !== PAYLOAD || !sig) return { authenticated: false };
    const expected = sign(secret, payload);
    if (sig !== expected) return { authenticated: false };
    return { authenticated: true };
  } catch {
    return { authenticated: false };
  }
}

export function setAdminCookie(): string {
  const secret = getSecret();
  const sig = sign(secret, PAYLOAD);
  const value = `${PAYLOAD}.${sig}`;
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isProd ? "; Secure" : ""}`;
}

export function clearAdminCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function verifyAdminPassword(password: string): boolean {
  try {
    const secret = getSecret();
    return password === secret && password.length >= 8;
  } catch {
    return false;
  }
}
