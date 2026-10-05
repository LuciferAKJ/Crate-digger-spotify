import { describe, expect, it, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateParams } from '../validateParams.js';

describe('validateParams middleware', () => {
  const testSchema = z.object({
    id: z.string().min(2),
  });

  it('stores parsed params on res.locals.validatedParams on success', () => {
    const middleware = validateParams(testSchema);
    const req = { params: { id: 'abc' } } as unknown as Request;
    const res = { locals: {} } as Response;
    const next: NextFunction = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.locals.validatedParams).toEqual({ id: 'abc' });
  });

  it('calls next with 400 INVALID_REQUEST HttpError on failure', () => {
    const middleware = validateParams(testSchema);
    const req = { params: { id: 'a' } } as unknown as Request;
    const res = { locals: {} } as Response;
    const next: NextFunction = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        payload: expect.objectContaining({
          code: 'INVALID_REQUEST',
        }),
      }),
    );
  });
});
