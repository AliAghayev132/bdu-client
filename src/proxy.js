import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function proxy(req) {
  const { pathname } = req.nextUrl;
  // Admin və faculty-system routeları i18n middleware-dən istisna
  if (pathname.startsWith("/admin") || pathname.startsWith("/faculty-system")) {
    return NextResponse.next();
  }
  return intl(req);
}

export const config = {
  matcher: ["/", "/(az|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
