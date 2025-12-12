import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
// Renamed from middleware.js to proxy.js to comply with Next.js 16+ conventions.
// This handles locale detection and routing.
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ja|en)/:path*']
};
