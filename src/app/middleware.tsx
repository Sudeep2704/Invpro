// src/middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const p = url.pathname;

  // Public paths + static
  if (
    p.startsWith("/login") ||
    p.startsWith("/signup") ||
    p.startsWith("/api/auth") ||
    p.startsWith("/_next/") ||
    p.startsWith("/SidebarIcons/") ||
    p === "/favicon.ico" ||
    p.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/)
  ) return NextResponse.next();

  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", p + url.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
