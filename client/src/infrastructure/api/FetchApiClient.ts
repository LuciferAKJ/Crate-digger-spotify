import type { AppErrorPayload } from '@crate-digger/shared';
import { ApiError, type IApiClient } from './IApiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export class FetchApiClient implements IApiClient {
  constructor(private readonly baseUrl: string = API_BASE_URL) {}

  async get<TResponse>(
    path: string,
    searchParams?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (searchParams) {
      for (const [key, value] of Object.entries(searchParams)) {
        url.searchParams.set(key, value);
      }
    }

    const response = await fetch(url, { signal: signal ?? null });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: AppErrorPayload } | null;
      const payload: AppErrorPayload = body?.error ?? {
        code: 'UNKNOWN',
        message: `Request to ${path} failed with status ${response.status}`,
      };
      throw new ApiError(response.status, payload);
    }

    return response.json() as Promise<TResponse>;
  }
}

export const apiClient = new FetchApiClient();
