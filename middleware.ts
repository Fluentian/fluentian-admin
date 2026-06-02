import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access login while already authenticated, redirect to dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Public routes (no sign-in required)
  const publicPaths = ['/login', '/help'];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // 3. If trying to access protected routes without token, redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
