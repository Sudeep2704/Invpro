// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Add any public pages here
const PUBLIC_PATHS = ["/", "/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) Ignore static files and Next.js internals
  const isPublicFile = /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/.test(pathname);
  if (pathname.startsWith("/_next/") || isPublicFile) return NextResponse.next();

  // 2) Always allow NextAuth endpoints
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // 3) Skip ALL other API routes (protect them in the route handlers with getServerSession)
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // 4) Allow explicitly public pages
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // 5) For everything else, require a session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    // preserve the original target
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run middleware on app pages (not API, not static)
export const config = {
  matcher: [
    // Run for all paths EXCEPT:
    // - /api (handled in code above, but we also prevent running here for perf)
    // - Next.js internals and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
