import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  setAdminCookie,
  getAdminAuth,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (getAdminAuth().authenticated) {
    return NextResponse.json({ ok: true });
  }
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 }
    );
  }
  const password =
    typeof body.password === "string" ? body.password.trim() : "";
  if (!password) {
    return NextResponse.json(
      { error: "Password required" },
      { status: 400 }
    );
  }
  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }
  const cookieHeader = setAdminCookie();
  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieHeader,
    },
  });
}
