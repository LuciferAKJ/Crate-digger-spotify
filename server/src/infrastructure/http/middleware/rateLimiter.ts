import rateLimit from 'express-rate-limit';
import type { AppErrorPayload } from '@crate-digger/shared';

export const apiRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const payload: AppErrorPayload = { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.', retryAfterSeconds: 60 };
    res.status(429).json({ error: payload });
  },
});

export const searchRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const payload: AppErrorPayload = { code: 'RATE_LIMITED', message: 'Too many searches. Please slow down for a moment.', retryAfterSeconds: 30 };
    res.status(429).json({ error: payload });
  },
});
