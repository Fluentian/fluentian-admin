/**
 * Rate Limiter
 * Simple client-side rate limiting to prevent API abuse
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate limited
 * @param key - Rate limit key (e.g., endpoint URL)
 * @param maxRequests - Max requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request should be allowed, false if rate limited
 */
export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    // New window or expired
    rateLimits.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    // Rate limited
    console.warn(`⚠️ Rate limit exceeded for ${key}. Max ${maxRequests} requests per ${windowMs}ms`);
    return false;
  }

  // Increment and allow
  entry.count++;
  return true;
};

/**
 * Get rate limit status
 */
export const getRateLimitStatus = (key: string): { remaining: number; resetAt: number } | null => {
  const entry = rateLimits.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now > entry.resetAt) {
    rateLimits.delete(key);
    return null;
  }

  return {
    remaining: Math.max(0, 10 - entry.count),
    resetAt: entry.resetAt,
  };
};

/**
 * Clear all rate limits
 */
export const clearRateLimits = (): void => {
  rateLimits.clear();
};

/**
 * Rate limit presets
 */
export const RATE_LIMITS = {
  AUTH: { requests: 5, window: 60000 }, // 5 requests per minute
  API: { requests: 30, window: 60000 }, // 30 requests per minute
  UPLOAD: { requests: 3, window: 60000 }, // 3 requests per minute
  SEARCH: { requests: 10, window: 60000 }, // 10 requests per minute
};
