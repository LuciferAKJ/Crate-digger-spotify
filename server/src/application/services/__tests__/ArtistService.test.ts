import { describe, expect, it, vi } from 'vitest';
import type { Artist } from '@crate-digger/shared';
import type { IMusicProvider } from '../../../domain/repositories/IMusicProvider.js';
import { SearchCache } from '../../../infrastructure/cache/SearchCache.js';
import { ArtistService } from '../ArtistService.js';
import { HttpError } from '../../../domain/errors/HttpError.js';

const fakeArtist: Artist = {
  id: '4Z8W4fKeB5YxbusRsdQVPb',
  name: 'Radiohead',
  images: [{ url: 'https://example.com/art.jpg', width: 640, height: 640 }],
  popularity: 82,
  genres: ['art rock', 'alternative rock'],
  followerCount: 9876543,
};

function createFakeProvider(): IMusicProvider {
  return {
    search: vi.fn(),
    getArtist: vi.fn().mockResolvedValue(fakeArtist),
    getArtistDiscography: vi.fn(),
    getAlbum: vi.fn(),
    getAlbumTracks: vi.fn(),
    getTrack: vi.fn(),
  };
}

describe('ArtistService', () => {
  it('calls provider on cache miss and returns artist', async () => {
    const provider = createFakeProvider();
    const service = new ArtistService(provider, new SearchCache());

    const result = await service.getArtist('4Z8W4fKeB5YxbusRsdQVPb');

    expect(provider.getArtist).toHaveBeenCalledWith('4Z8W4fKeB5YxbusRsdQVPb');
    expect(provider.getArtist).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeArtist);
  });

  it('serves a repeated call from cache without hitting provider', async () => {
    const provider = createFakeProvider();
    const service = new ArtistService(provider, new SearchCache());

    await service.getArtist('4Z8W4fKeB5YxbusRsdQVPb');
    const cachedResult = await service.getArtist('4Z8W4fKeB5YxbusRsdQVPb');

    expect(provider.getArtist).toHaveBeenCalledTimes(1);
    expect(cachedResult).toEqual(fakeArtist);
  });

  it('normalizes artist ID by trimming surrounding whitespace', async () => {
    const provider = createFakeProvider();
    const service = new ArtistService(provider, new SearchCache());

    await service.getArtist('  4Z8W4fKeB5YxbusRsdQVPb  ');
    await service.getArtist('4Z8W4fKeB5YxbusRsdQVPb');

    expect(provider.getArtist).toHaveBeenCalledWith('4Z8W4fKeB5YxbusRsdQVPb');
    expect(provider.getArtist).toHaveBeenCalledTimes(1);
  });

  it('works without a cache provided', async () => {
    const provider = createFakeProvider();
    const service = new ArtistService(provider);

    const result = await service.getArtist('4Z8W4fKeB5YxbusRsdQVPb');
    expect(result).toEqual(fakeArtist);
    expect(provider.getArtist).toHaveBeenCalledTimes(1);
  });

  it('propagates provider errors cleanly', async () => {
    const provider = createFakeProvider();
    vi.mocked(provider.getArtist).mockRejectedValue(
      new HttpError(404, { code: 'NOT_FOUND', message: 'Artist not found.' }),
    );
    const service = new ArtistService(provider, new SearchCache());

    await expect(service.getArtist('nonexistent')).rejects.toMatchObject({
      statusCode: 404,
      payload: { code: 'NOT_FOUND' },
    });
  });
});
