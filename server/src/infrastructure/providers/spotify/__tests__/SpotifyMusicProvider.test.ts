import { describe, expect, it, vi } from 'vitest';
import { SpotifyMusicProvider } from '../SpotifyMusicProvider.js';
import type { SpotifyHttpClient } from '../SpotifyHttpClient.js';
import { HttpError } from '../../../../domain/errors/HttpError.js';

function createMockHttpClient(): SpotifyHttpClient {
  return {
    get: vi.fn(),
  } as unknown as SpotifyHttpClient;
}

describe('SpotifyMusicProvider.getArtist', () => {
  it('fetches an artist by ID and maps it to domain Artist entity', async () => {
    const mockHttp = createMockHttpClient();
    const rawArtist = {
      id: '4Z8W4fKeB5YxbusRsdQVPb',
      name: 'Radiohead',
      images: [
        { url: 'https://example.com/img-large.jpg', width: 640, height: 640 },
        { url: 'https://example.com/img-small.jpg', width: 300, height: 300 },
      ],
      popularity: 82,
      genres: ['art rock', 'alternative rock'],
      followers: { total: 9876543 },
    };

    vi.mocked(mockHttp.get).mockResolvedValue(rawArtist);
    const provider = new SpotifyMusicProvider(mockHttp);

    const result = await provider.getArtist('4Z8W4fKeB5YxbusRsdQVPb');

    expect(mockHttp.get).toHaveBeenCalledWith('/artists/4Z8W4fKeB5YxbusRsdQVPb');
    expect(result).toEqual({
      id: '4Z8W4fKeB5YxbusRsdQVPb',
      name: 'Radiohead',
      images: [
        { url: 'https://example.com/img-large.jpg', width: 640, height: 640 },
        { url: 'https://example.com/img-small.jpg', width: 300, height: 300 },
      ],
      popularity: 82,
      genres: ['art rock', 'alternative rock'],
      followerCount: 9876543,
    });
  });

  it('maps safely when optional fields are absent (Spotify Dev Mode)', async () => {
    const mockHttp = createMockHttpClient();
    const rawArtist = {
      id: 'a1',
      name: 'Indie Artist',
    };

    vi.mocked(mockHttp.get).mockResolvedValue(rawArtist);
    const provider = new SpotifyMusicProvider(mockHttp);

    const result = await provider.getArtist('a1');

    expect(result).toEqual({
      id: 'a1',
      name: 'Indie Artist',
      images: [],
      popularity: 0,
      genres: [],
      followerCount: null,
    });
  });

  it('throws 502 UPSTREAM_UNAVAILABLE when Spotify returns malformed data', async () => {
    const mockHttp = createMockHttpClient();
    vi.mocked(mockHttp.get).mockResolvedValue({ invalid: 'payload' });
    const provider = new SpotifyMusicProvider(mockHttp);

    await expect(provider.getArtist('a1')).rejects.toThrowError(HttpError);
    await expect(provider.getArtist('a1')).rejects.toMatchObject({
      statusCode: 502,
      payload: {
        code: 'UPSTREAM_UNAVAILABLE',
        message: 'Received an unexpected response from the music catalog.',
      },
    });
  });

  it('propagates 404 NOT_FOUND error when SpotifyHttpClient throws 404', async () => {
    const mockHttp = createMockHttpClient();
    vi.mocked(mockHttp.get).mockRejectedValue(
      new HttpError(404, { code: 'NOT_FOUND', message: 'The requested item could not be found.' }),
    );
    const provider = new SpotifyMusicProvider(mockHttp);

    await expect(provider.getArtist('unknown-id')).rejects.toMatchObject({
      statusCode: 404,
      payload: { code: 'NOT_FOUND' },
    });
  });

  it('propagates 502 error when SpotifyHttpClient encounters network/upstream error', async () => {
    const mockHttp = createMockHttpClient();
    vi.mocked(mockHttp.get).mockRejectedValue(
      new HttpError(502, { code: 'UPSTREAM_UNAVAILABLE', message: 'Could not reach the music catalog.' }),
    );
    const provider = new SpotifyMusicProvider(mockHttp);

    await expect(provider.getArtist('a1')).rejects.toMatchObject({
      statusCode: 502,
      payload: { code: 'UPSTREAM_UNAVAILABLE' },
    });
  });
});
