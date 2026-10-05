import { describe, expect, it } from 'vitest';
import { artistRequestParamsSchema } from '../artistRequestParams.js';

describe('artistRequestParamsSchema', () => {
  it('accepts a valid Spotify artist ID', () => {
    const result = artistRequestParamsSchema.safeParse({ id: '4Z8W4fKeB5YxbusRsdQVPb' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('4Z8W4fKeB5YxbusRsdQVPb');
    }
  });

  it('trims whitespace and accepts valid alphanumeric ID', () => {
    const result = artistRequestParamsSchema.safeParse({ id: '  4Z8W4fKeB5YxbusRsdQVPb  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('4Z8W4fKeB5YxbusRsdQVPb');
    }
  });

  it('rejects an empty ID', () => {
    const result = artistRequestParamsSchema.safeParse({ id: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an ID with special characters or path traversal', () => {
    expect(artistRequestParamsSchema.safeParse({ id: '../invalid' }).success).toBe(false);
    expect(artistRequestParamsSchema.safeParse({ id: 'artist/123' }).success).toBe(false);
    expect(artistRequestParamsSchema.safeParse({ id: 'artist;drop table' }).success).toBe(false);
    expect(artistRequestParamsSchema.safeParse({ id: 'artist@id' }).success).toBe(false);
  });

  it('rejects an ID that exceeds maximum length', () => {
    const longId = 'a'.repeat(101);
    expect(artistRequestParamsSchema.safeParse({ id: longId }).success).toBe(false);
  });
});
