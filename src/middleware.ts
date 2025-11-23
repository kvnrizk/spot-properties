import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default auth(async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    const session = req.auth;

    // Redirect to login if not authenticated
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if authenticated but not admin
    if (session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow access to admin routes
    return NextResponse.next();
  }

  // Skip i18n for login route
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(req);
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
