import type { Album, Artist, ReleaseType, SearchQuery, SearchResult, Track } from '@crate-digger/shared';
import type { IMusicProvider } from '../../../domain/repositories/IMusicProvider.js';
import { HttpError } from '../../../domain/errors/HttpError.js';
import type { SpotifyHttpClient } from './SpotifyHttpClient.js';
import { spotifySearchResponseSchema } from './schemas/spotifySchemas.js';
import { mapSpotifyAlbum, mapSpotifyArtist, mapSpotifyTrack } from './mappers/spotifyMappers.js';

const emptyPaged = { items: [], total: 0, limit: 0, offset: 0 };

export class SpotifyMusicProvider implements IMusicProvider {
  constructor(private readonly http: SpotifyHttpClient) {}

  async search(query: SearchQuery): Promise<SearchResult> {
    const limit = query.limit ?? 5; // Spotify Feb 2026 Dev Mode default
    const offset = query.offset ?? 0;

    const raw = await this.http.get('/search', {
      q: query.query,
      type: query.categories.join(','),
      limit: String(limit),
      offset: String(offset),
    });

    const parsed = spotifySearchResponseSchema.safeParse(raw);
    if (!parsed.success) {
      throw new HttpError(502, {
        code: 'UPSTREAM_UNAVAILABLE',
        message: 'Received an unexpected response from the music catalog.',
      });
    }

    const data = parsed.data;

    return {
      artists: data.artists ? { ...data.artists, items: data.artists.items.map(mapSpotifyArtist) } : emptyPaged,
      albums: data.albums ? { ...data.albums, items: data.albums.items.map(mapSpotifyAlbum) } : emptyPaged,
      tracks: data.tracks ? { ...data.tracks, items: data.tracks.items.map(mapSpotifyTrack) } : emptyPaged,
    };
  }

  async getArtist(_id: string): Promise<Artist> {
    throw new NotImplementedInPhaseError('getArtist', 3);
  }

  async getArtistDiscography(_id: string, _releaseType: ReleaseType): Promise<Album[]> {
    throw new NotImplementedInPhaseError('getArtistDiscography', 3);
  }

  async getAlbum(_id: string): Promise<Album> {
    throw new NotImplementedInPhaseError('getAlbum', 3);
  }

  async getAlbumTracks(_id: string): Promise<Track[]> {
    throw new NotImplementedInPhaseError('getAlbumTracks', 3);
  }

  async getTrack(_id: string): Promise<Track> {
    throw new NotImplementedInPhaseError('getTrack', 3);
  }
}

class NotImplementedInPhaseError extends Error {
  constructor(method: string, phase: number) {
    super(`SpotifyMusicProvider.${method}() is not implemented until Phase ${phase}.`);
    this.name = 'NotImplementedInPhaseError';
  }
}
