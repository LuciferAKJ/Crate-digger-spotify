import { describe, expect, it } from 'vitest';
import { spotifyArtistResponseSchema, spotifySearchResponseSchema } from '../spotifySchemas.js';

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

describe('spotifyArtistResponseSchema (Spotify Feb 2026 Dev Mode compatibility)', () => {
  it('parses a complete Spotify artist response', () => {
    const raw = {
      id: '4Z8W4fKeB5YxbusRsdQVPb',
      name: 'Radiohead',
      images: [{ url: 'https://example.com/art.jpg', width: 640, height: 640 }],
      popularity: 82,
      genres: ['art rock', 'alternative rock'],
      followers: { total: 9876543 },
    };
    const result = spotifyArtistResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: '4Z8W4fKeB5YxbusRsdQVPb',
        name: 'Radiohead',
        images: [{ url: 'https://example.com/art.jpg', width: 640, height: 640 }],
        popularity: 82,
        genres: ['art rock', 'alternative rock'],
        followers: { total: 9876543 },
      });
    }
  });

  it('parses an artist response missing optional fields (no images, popularity, genres, followers)', () => {
    const raw = {
      id: '4Z8W4fKeB5YxbusRsdQVPb',
      name: 'Radiohead',
    };
    const result = spotifyArtistResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: '4Z8W4fKeB5YxbusRsdQVPb',
        name: 'Radiohead',
        images: [],
        popularity: 0,
        genres: [],
        followers: undefined,
      });
    }
  });

  it('handles null values in optional fields (null popularity, null images, null genres, null followers)', () => {
    const raw = {
      id: '4Z8W4fKeB5YxbusRsdQVPb',
      name: 'Radiohead',
      images: null,
      popularity: null,
      genres: null,
      followers: null,
    };
    const result = spotifyArtistResponseSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.popularity).toBe(0);
      expect(result.data.images).toEqual([]);
      expect(result.data.genres).toEqual([]);
      expect(result.data.followers).toBeNull();
    }
  });

  it('rejects a malformed artist response missing required id', () => {
    const raw = { name: 'Radiohead' };
    const result = spotifyArtistResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it('rejects a malformed artist response missing required name', () => {
    const raw = { id: '4Z8W4fKeB5YxbusRsdQVPb' };
    const result = spotifyArtistResponseSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });
});
