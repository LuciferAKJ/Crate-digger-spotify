import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import { HttpError } from '../../../../domain/errors/HttpError.js';
import { errorHandler, notFoundHandler } from '../errorHandler.js';

function createFakeResponse(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  it('maps HttpError to its own status code and payload', () => {
    const res = createFakeResponse();
    const err = new HttpError(429, { code: 'RATE_LIMITED', message: 'slow down', retryAfterSeconds: 10 });

    errorHandler(err, {} as never, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: err.payload });
  });

  it('maps an unknown thrown value to a generic 500 UNKNOWN, never leaking internals', () => {
    const res = createFakeResponse();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(new Error('db connection string: secret'), {} as never, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { code: 'UNKNOWN', message: 'Something went wrong on our end.' } });
    consoleSpy.mockRestore();
  });
});

describe('notFoundHandler', () => {
  it('returns a structured 404 naming the method and path', () => {
    const res = createFakeResponse();
    notFoundHandler({ method: 'GET', path: '/api/bogus' } as never, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { code: 'NOT_FOUND', message: 'No route for GET /api/bogus' } });
  });
});
