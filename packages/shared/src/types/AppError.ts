/**
 * Stable error codes the client can branch on to pick the right UI state
 * (Part 14/15 of the design spec: rate-limited, offline, not-found, etc.)
 * without inspecting provider-specific error shapes.
 */
export type AppErrorCode =
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'UNKNOWN';

export interface AppErrorPayload {
  code: AppErrorCode;
  message: string;
  /** Seconds until it's safe to retry, when known (e.g. from a 429 Retry-After header). */
  retryAfterSeconds?: number;
}
