import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/login", "/register", "/api/auth", "/favicon.ico", "/_next", "/landing", "/products"];

  if (publicRoutes.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user) {
    const landingUrl = new URL("/landing", req.url);
    return NextResponse.redirect(landingUrl);
  }

  const role = session.user.role;

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/delivery") && role !== "deliveryMan") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};