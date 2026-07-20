import { NextRequest } from 'next/server';

interface RateLimitTracker {
  tokens: number;
  lastRefill: number;
}

const trackers = new Map<string, RateLimitTracker>();

interface RateLimiterOptions {
  limit: number;       // Max tokens in bucket
  interval: number;    // Refill interval in milliseconds
  refillAmount: number; // Tokens refilled per interval
}

/**
 * Basic in-memory Token Bucket rate limiter.
 * In a distributed, multi-server production environment, this should delegate to Redis.
 */
export function rateLimiter(
  req: NextRequest,
  options: RateLimiterOptions = { limit: 60, interval: 60000, refillAmount: 60 }
): { success: boolean; limit: number; remaining: number; reset: number } {
  const ip = req.headers.get('x-forwarded-for') || (req as any).ip || 'anonymous';
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();

  let tracker = trackers.get(key);

  if (!tracker) {
    tracker = {
      tokens: options.limit,
      lastRefill: now,
    };
    trackers.set(key, tracker);
  }

  // Refill tokens based on time elapsed
  const elapsed = now - tracker.lastRefill;
  if (elapsed >= options.interval) {
    const intervalsElapsed = Math.floor(elapsed / options.interval);
    tracker.tokens = Math.min(
      options.limit,
      tracker.tokens + intervalsElapsed * options.refillAmount
    );
    tracker.lastRefill = now;
  }

  // Check if token can be consumed
  if (tracker.tokens > 0) {
    tracker.tokens--;
    trackers.set(key, tracker);
    
    // Cleanup old keys to prevent memory leaks in memory cache
    if (trackers.size > 10000) {
      const oldestKey = trackers.keys().next().value;
      if (oldestKey) trackers.delete(oldestKey);
    }

    return {
      success: true,
      limit: options.limit,
      remaining: tracker.tokens,
      reset: Math.max(0, options.interval - (now - tracker.lastRefill)),
    };
  }

  return {
    success: false,
    limit: options.limit,
    remaining: 0,
    reset: Math.max(0, options.interval - (now - tracker.lastRefill)),
  };
}
