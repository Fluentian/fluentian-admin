import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge-safe expiry check. The signature is NOT verified here and must not be
 * trusted for authorisation -- the API verifies every request. This gate only
 * decides whether to render the dashboard shell or bounce to /login, and it
 * previously checked nothing but the cookie's *presence*. Paired with a cookie
 * that outlived its 15-minute token, that meant a user was let into a
 * dashboard where every single request 401ed, with no redirect.
 */
function isUsableToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    if (typeof payload?.exp !== 'number') return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const authenticated = isUsableToken(token);
  const { pathname } = request.nextUrl;

  // 1. If trying to access login while already authenticated, redirect to dashboard
  if (pathname === '/login' && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Public routes (no sign-in required)
  const publicPaths = ['/login', '/help'];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // 3. If trying to access protected routes without a usable token, go to login
  if (!isPublic && !authenticated) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (token) {
      // Clear the stale cookie so the next navigation is not gated on it again.
      response.cookies.delete('accessToken');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
