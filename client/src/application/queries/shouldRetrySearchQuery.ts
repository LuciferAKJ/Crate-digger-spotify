import { ApiError } from '@infrastructure/api/IApiClient';

export function shouldRetrySearchQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }
  if (error instanceof ApiError) {
    return error.payload.code !== 'INVALID_REQUEST' && error.payload.code !== 'NOT_FOUND';
  }
  return true;
}
