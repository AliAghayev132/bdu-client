// src/middleware.js
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  return intl(req);
}

export const config = {
  matcher: ['/', '/(az|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};