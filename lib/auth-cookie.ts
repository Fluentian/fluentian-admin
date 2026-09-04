import Cookies from 'js-cookie';

export const ACCESS_COOKIE = 'accessToken';

/**
 * The middleware needs to read the access token, so it has to live in a cookie
 * that JS can write. It is NOT httpOnly and never can be while the client sets
 * it -- `js-cookie` cannot produce an httpOnly cookie, despite the comment that
 * used to claim otherwise in lib/store/auth.ts.
 *
 * Two things kept this honest-but-broken:
 *  - `auth.ts` set `expires: 1` (24h) while the access token lives 15 minutes,
 *    so the middleware waved users through for a day into a dashboard where
 *    every request 401ed.
 *  - the login page then re-set the same cookie with different options, so
 *    which one won depended on call order.
 *
 * Both paths now come here, and the cookie's lifetime is derived from the
 * token's own `exp` so the gate and the credential expire together.
 */
export function setAccessCookie(token: string): void {
  Cookies.set(ACCESS_COOKIE, token, {
    expires: expiryDate(token),
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite: 'strict',
    path: '/',
  });
}

export function clearAccessCookie(): void {
  Cookies.remove(ACCESS_COOKIE, { path: '/' });
}

function expiryDate(token: string): Date | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload?.exp === 'number') {
      return new Date(payload.exp * 1000);
    }
  } catch {
    // Fall through to a session cookie rather than trusting a bad token.
  }
  return undefined;
}
