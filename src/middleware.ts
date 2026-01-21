import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const PUBLIC_PATHS = ['/', '/api/auth'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'))) {
    // If already authenticated and visiting login page, redirect to research
    if (path === '/') {
      const authCookie = request.cookies.get('ai-auth');
      if (authCookie?.value === 'authenticated') {
        return NextResponse.redirect(new URL('/research', request.url));
      }
    }
    return NextResponse.next();
  }

  // Check auth cookie for protected routes
  const authCookie = request.cookies.get('ai-auth');

  if (!authCookie || authCookie.value !== 'authenticated') {
    // Redirect to login page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
