import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const protectedApiRoutes = ["/api/protected"];
const authRoutes = ["/login", "/register"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isSuspended = req.auth?.user?.isSuspended;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isProtectedApi = protectedApiRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
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
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*", "/login", "/register"],
};
