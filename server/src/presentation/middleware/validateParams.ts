import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodSchema } from 'zod';
import { HttpError } from '../../domain/errors/HttpError.js';

export function validateParams<TSchema extends ZodSchema>(schema: TSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      next(
        new HttpError(400, {
          code: 'INVALID_REQUEST',
          message: firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Invalid request parameters.',
        }),
      );
      return;
    }
    res.locals.validatedParams = parsed.data;
    next();
  };
}
