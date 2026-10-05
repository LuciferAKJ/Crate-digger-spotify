import { describe, expect, it } from 'vitest';
import type { SearchResult } from '@crate-digger/shared';
import { flattenSearchResults } from '../searchResultAdapters';

const emptyPaged = { items: [], total: 0, limit: 0, offset: 0 };

describe('flattenSearchResults', () => {
  it('orders artists, then albums, then tracks (matches visual column order)', () => {
    const result: SearchResult = {
      artists: { ...emptyPaged, items: [{ id: 'ar1', name: 'A', images: [], popularity: 0, genres: [], followerCount: null }] },
      albums: { ...emptyPaged, items: [{ id: 'al1', name: 'B', images: [], releaseType: 'album', releaseDate: '2020', releaseDatePrecision: 'year', label: null, copyrightText: null, trackCount: 1, artists: [], popularity: null }] },
      tracks: { ...emptyPaged, items: [{ id: 't1', name: 'C', trackNumber: 1, discNumber: 1, durationMs: 1000, explicit: false, popularity: 0, previewUrl: null, album: { id: 'al1', name: 'B', images: [] }, artists: [] }] },
    };

    const items = flattenSearchResults(result);

    expect(items.map((i) => i.type)).toEqual(['artist', 'album', 'track']);
    expect(items.map((i) => i.href)).toEqual(['/artist/ar1', '/album/al1', '/track/t1']);
  });

  it('returns an empty list for an all-empty result', () => {
    const result: SearchResult = { artists: emptyPaged, albums: emptyPaged, tracks: emptyPaged };
    expect(flattenSearchResults(result)).toEqual([]);
  });
});
