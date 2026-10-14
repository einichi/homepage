import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
// Renamed from middleware.js to proxy.js to comply with Next.js 16+ conventions.
// This handles locale detection and routing.
export default createMiddleware(routing);
 
export const config = {
  // Match locale-prefixed internationalized pathnames, plus any unprefixed
  // path so the middleware can redirect it to the active locale. Previously
  // `/work` and `/contact` never reached the middleware and 404'd.
  // The dot-exclusion keeps static assets (/models/*, /images/*, /favicon/*,
  // /_next/*) and future /sitemap.xml out of the middleware.
  matcher: ['/', '/(en|ja)/:path*', '/((?!api|_next|_vercel|.*\\.).*)']
};
