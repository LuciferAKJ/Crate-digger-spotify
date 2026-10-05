import type { AppErrorPayload } from '@crate-digger/shared';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly payload: AppErrorPayload,
  ) {
    super(payload.message);
    this.name = 'HttpError';
  }
}
