// Simple in-memory rate limiter, keyed by identifier (e.g. IP or email).
// Sliding-window style: tracks timestamps of recent attempts and
// rejects once the count within the window exceeds the limit.
//
// LIMITATION: this state lives in the serverless function's memory,
// which is not shared across instances or guaranteed to persist
// between invocations on Vercel. Sufficient to demonstrate and
// deter casual brute-force attempts in this assessment's scope; a
// production deployment should use a shared store (e.g. Redis /
// Upstash) so limits hold across all instances.

interface RateLimitEntry {
  attemptTimestamps: number[];
}

const attemptsByKey = new Map<string, RateLimitEntry>();

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS_PER_WINDOW = 5;

export interface RateLimitResult {
  isAllowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
  retryAfterFormatted: string;
}

// Formats a duration in seconds as "Xm Ys" (or just "Ys" under a minute),
// so error messages read naturally instead of showing raw seconds.
function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = attemptsByKey.get(key) ?? { attemptTimestamps: [] };

  // Drop timestamps outside the current window before counting.
  const recentAttempts = entry.attemptTimestamps.filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  const isAllowed = recentAttempts.length < MAX_ATTEMPTS_PER_WINDOW;

  if (isAllowed) {
    recentAttempts.push(now);
  }

  attemptsByKey.set(key, { attemptTimestamps: recentAttempts });

  const oldestAttempt = recentAttempts[0];
  const retryAfterSeconds = oldestAttempt
    ? Math.ceil((WINDOW_MS - (now - oldestAttempt)) / 1000)
    : 0;

  return {
    isAllowed,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS_PER_WINDOW - recentAttempts.length),
    retryAfterSeconds,
    retryAfterFormatted: formatDuration(retryAfterSeconds),
  };
}