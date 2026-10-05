import { describe, expect, it } from 'vitest';
import { searchRequestQuerySchema } from '../searchRequestQuery.js';

describe('searchRequestQuerySchema', () => {
  it('rejects an empty q', () => {
    expect(searchRequestQuerySchema.safeParse({ q: '' }).success).toBe(false);
  });

  it('defaults type to all three categories and limit to 5 (Spotify Dev Mode default)', () => {
    const result = searchRequestQuerySchema.parse({ q: 'test' });
    expect(result.type).toEqual(['artist', 'album', 'track']);
    expect(result.limit).toBe(5);
    expect(result.offset).toBe(0);
  });

  it('rejects a limit above 10 (Spotify Dev Mode max)', () => {
    expect(searchRequestQuerySchema.safeParse({ q: 'test', limit: '11' }).success).toBe(false);
  });

  it('accepts a limit of exactly 10', () => {
    expect(searchRequestQuerySchema.safeParse({ q: 'test', limit: '10' }).success).toBe(true);
  });

  it('rejects an unknown category in type', () => {
    expect(searchRequestQuerySchema.safeParse({ q: 'test', type: 'playlist' }).success).toBe(false);
  });

  it('parses a comma-separated type list', () => {
    const result = searchRequestQuerySchema.parse({ q: 'test', type: 'artist,album' });
    expect(result.type).toEqual(['artist', 'album']);
  });
});
