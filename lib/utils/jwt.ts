/**
 * JWT Token Utilities
 * Decode, validate, and check token expiration
 */

/**
 * Decode JWT token without verification (client-side only)
 * WARNING: This does not verify the token signature!
 * Always verify tokens server-side before trusting claims
 */
export const decodeToken = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token format');
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now;
};

/**
 * Get token expiration time
 */
export const getTokenExpirationTime = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  return new Date(decoded.exp * 1000);
};

/**
 * Check if token is expiring soon (within threshold)
 */
export const isTokenExpiringSoon = (token: string, thresholdMs: number = 5 * 60 * 1000): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const now = Date.now();
  const expiryTime = decoded.exp * 1000;
  const timeRemaining = expiryTime - now;

  return timeRemaining < thresholdMs;
};

/**
 * Get time remaining until token expires
 */
export const getTokenTimeRemaining = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - now);
};

/**
 * Format token expiration for display
 */
export const formatTokenExpiration = (token: string): string => {
  const remaining = getTokenTimeRemaining(token);

  if (remaining === 0) {
    return 'Expired';
  }

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
