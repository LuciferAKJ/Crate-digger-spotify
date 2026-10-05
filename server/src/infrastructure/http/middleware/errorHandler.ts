import type { NextFunction, Request, Response } from 'express';
import type { AppErrorPayload } from '@crate-digger/shared';
import { HttpError } from '../../../domain/errors/HttpError.js';

export { HttpError };

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.payload });
    return;
  }
  console.error('Unhandled error:', err);
  const fallback: AppErrorPayload = { code: 'UNKNOWN', message: 'Something went wrong on our end.' };
  res.status(500).json({ error: fallback });
}

export function notFoundHandler(req: Request, res: Response): void {
  const payload: AppErrorPayload = { code: 'NOT_FOUND', message: `No route for ${req.method} ${req.path}` };
  res.status(404).json({ error: payload });
}
