import type { AppErrorPayload } from '@crate-digger/shared';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: AppErrorPayload,
  ) {
    super(payload.message);
    this.name = 'ApiError';
  }
}

export interface IApiClient {
  get<TResponse>(path: string, searchParams?: Record<string, string>, signal?: AbortSignal): Promise<TResponse>;
}
