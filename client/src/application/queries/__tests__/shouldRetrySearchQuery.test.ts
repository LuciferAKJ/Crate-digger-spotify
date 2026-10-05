import { describe, expect, it } from 'vitest';
import { ApiError } from '@infrastructure/api/IApiClient';
import { shouldRetrySearchQuery } from '../shouldRetrySearchQuery';

describe('shouldRetrySearchQuery', () => {
  it('does not retry INVALID_REQUEST', () => {
    const err = new ApiError(400, { code: 'INVALID_REQUEST', message: 'bad' });
    expect(shouldRetrySearchQuery(0, err)).toBe(false);
  });

  it('does not retry NOT_FOUND', () => {
    const err = new ApiError(404, { code: 'NOT_FOUND', message: 'nope' });
    expect(shouldRetrySearchQuery(0, err)).toBe(false);
  });

  it('retries RATE_LIMITED up to 2 attempts', () => {
    const err = new ApiError(429, { code: 'RATE_LIMITED', message: 'slow down' });
    expect(shouldRetrySearchQuery(0, err)).toBe(true);
    expect(shouldRetrySearchQuery(1, err)).toBe(true);
    expect(shouldRetrySearchQuery(2, err)).toBe(false);
  });

  it('retries an unknown thrown value (network error) up to the cap', () => {
    expect(shouldRetrySearchQuery(0, new TypeError('network'))).toBe(true);
    expect(shouldRetrySearchQuery(2, new TypeError('network'))).toBe(false);
  });
});
