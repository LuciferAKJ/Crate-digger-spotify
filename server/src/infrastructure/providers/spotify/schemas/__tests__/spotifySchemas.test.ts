import { describe, expect, it } from 'vitest';
import { spotifySearchResponseSchema } from '../spotifySchemas.js';

describe('spotifySearchResponseSchema (Spotify Feb 2026 Dev Mode compatibility)', () => {
  it('parses a response missing artist popularity/followers (fields removed in Dev Mode)', () => {
    const raw = {
      artists: {
        items: [{ id: 'a1', name: 'Radiohead' }], // no popularity, no followers, no images, no genres
        total: 1, limit: 5, offset: 0,
      },
    };
    const result = spotifySearchResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.artists?.items[0]).toMatchObject({ id: 'a1', name: 'Radiohead', popularity: 0, genres: [] });
    }
  });

  it('parses a track missing popularity/available_markets (removed in Dev Mode)', () => {
    const raw = {
      tracks: {
        items: [{
          id: 't1', name: 'Idioteque',
          album: { id: 'al1', name: 'Kid A', album_type: 'album', release_date: '2000', release_date_precision: 'year' },
          artists: [{ id: 'a1', name: 'Radiohead' }],
        }],
        total: 1, limit: 5, offset: 0,
      },
    };
    const result = spotifySearchResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
  });

  it('rejects a response where an item is missing a required identity field (id)', () => {
    const raw = { artists: { items: [{ name: 'No ID' }], total: 1, limit: 5, offset: 0 } };
    const result = spotifySearchResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it('accepts an empty response (no categories requested/returned)', () => {
    expect(spotifySearchResponseSchema.safeParse({}).success).toBe(true);
  });
});
