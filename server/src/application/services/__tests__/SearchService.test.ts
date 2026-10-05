import { describe, expect, it, vi } from 'vitest';
import type { IMusicProvider } from '../../../domain/repositories/IMusicProvider.js';
import { SearchCache } from '../../../infrastructure/cache/SearchCache.js';
import { SearchService } from '../SearchService.js';
import type { SearchResult } from '@crate-digger/shared';

const emptyPaged = { items: [], total: 0, limit: 0, offset: 0 };
const fakeResult: SearchResult = { artists: emptyPaged, albums: emptyPaged, tracks: emptyPaged };

function createFakeProvider(): IMusicProvider {
  return {
    search: vi.fn().mockResolvedValue(fakeResult),
    getArtist: vi.fn(),
    getArtistDiscography: vi.fn(),
    getAlbum: vi.fn(),
    getAlbumTracks: vi.fn(),
    getTrack: vi.fn(),
  };
}

describe('SearchService', () => {
  it('calls the provider on a cache miss', async () => {
    const provider = createFakeProvider();
    const service = new SearchService(provider, new SearchCache());

    const result = await service.search({ query: 'radiohead', categories: ['artist'] });

    expect(provider.search).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeResult);
  });

  it('serves a repeated identical query from cache, not the provider', async () => {
    const provider = createFakeProvider();
    const service = new SearchService(provider, new SearchCache());
    const query = { query: 'radiohead', categories: ['artist' as const] };

    await service.search(query);
    await service.search(query);

    expect(provider.search).toHaveBeenCalledTimes(1);
  });

  it('normalizes the cache key — case and surrounding whitespace do not create separate entries', async () => {
    const provider = createFakeProvider();
    const service = new SearchService(provider, new SearchCache());

    await service.search({ query: 'Radiohead', categories: ['artist'] });
    await service.search({ query: '  radiohead  ', categories: ['artist'] });

    expect(provider.search).toHaveBeenCalledTimes(1);
  });

  it('normalizes the cache key — category order does not create separate entries', async () => {
    const provider = createFakeProvider();
    const service = new SearchService(provider, new SearchCache());

    await service.search({ query: 'daft punk', categories: ['album', 'artist'] });
    await service.search({ query: 'daft punk', categories: ['artist', 'album'] });

    expect(provider.search).toHaveBeenCalledTimes(1);
  });

  it('treats a different query as a genuine cache miss', async () => {
    const provider = createFakeProvider();
    const service = new SearchService(provider, new SearchCache());

    await service.search({ query: 'radiohead', categories: ['artist'] });
    await service.search({ query: 'daft punk', categories: ['artist'] });

    expect(provider.search).toHaveBeenCalledTimes(2);
  });

  it('treats a different limit/offset as a genuine cache miss (pagination must not collide)', async () => {
    const provider = createFakeProvider();
    const service = new SearchService(provider, new SearchCache());

    await service.search({ query: 'radiohead', categories: ['artist'], limit: 5, offset: 0 });
    await service.search({ query: 'radiohead', categories: ['artist'], limit: 5, offset: 5 });

    expect(provider.search).toHaveBeenCalledTimes(2);
  });
});
