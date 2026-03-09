import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export async function GET() {
  const cookieHeader = clearAdminCookie();
  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), {
    status: 302,
    headers: { "Set-Cookie": cookieHeader },
  });
}

export async function POST() {
  const cookieHeader = clearAdminCookie();
  return new NextResponse(null, {
    status: 204,
    headers: { "Set-Cookie": cookieHeader },
  });
}
