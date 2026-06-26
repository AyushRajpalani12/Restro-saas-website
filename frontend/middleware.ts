import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path === "/favicon.ico" ||
    path === "/unauthorized"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
  });

  const isAuthRoute =
    path.startsWith("/super-admin") ||
    path.startsWith("/admin") ||
    path.startsWith("/branch") ||
    path.startsWith("/kitchen") ||
    path.startsWith("/staff") ||
    path.startsWith("/cashier");

  if (isAuthRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = token.role;

    if (path.startsWith("/super-admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (path.startsWith("/admin") && role !== "RESTAURANT_ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (path.startsWith("/branch") && role !== "BRANCH_MANAGER" && role !== "RESTAURANT_ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      path.startsWith("/kitchen") &&
      role !== "KITCHEN" &&
      role !== "BRANCH_MANAGER" &&
      role !== "RESTAURANT_ADMIN" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      path.startsWith("/staff") &&
      role !== "STAFF" &&
      role !== "CASHIER" &&
      role !== "BRANCH_MANAGER" &&
      role !== "RESTAURANT_ADMIN" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      path.startsWith("/cashier") &&
      role !== "CASHIER" &&
      role !== "BRANCH_MANAGER" &&
      role !== "RESTAURANT_ADMIN" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/branch/:path*",
    "/kitchen/:path*",
    "/staff/:path*",
    "/cashier/:path*",
  ],
};
