import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/dashboard"];
const protectedApiRoutes = ["/api/protected"];
const authRoutes = ["/login", "/register"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as Record<string, unknown> | undefined;
  const isSuspended = user?.isSuspended;
  const role = user?.role as string | undefined;

  const isProtectedRoute = protectedRoutes.some((r) =>
    nextUrl.pathname.startsWith(r)
  );
  const isProtectedApi = protectedApiRoutes.some((r) =>
    nextUrl.pathname.startsWith(r)
  );
  const isAuthRoute = authRoutes.some((r) =>
    nextUrl.pathname.startsWith(r)
  );

  if (isSuspended) {
    return NextResponse.redirect(new URL("/login?error=suspended", nextUrl));
  }

  if (isProtectedRoute || isProtectedApi) {
    if (!isLoggedIn) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
      );
    }

    if (nextUrl.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (
      nextUrl.pathname.startsWith("/dashboard/dealership") &&
      role !== "DEALER" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (
      nextUrl.pathname.startsWith("/dashboard/vehicles") &&
      role !== "DEALER" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*", "/login", "/register"],
};
