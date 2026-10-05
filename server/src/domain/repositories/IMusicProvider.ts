import type { Album, Artist, ReleaseType, SearchQuery, SearchResult, Track } from '@crate-digger/shared';

/**
 * The single seam between the application layer and any external music
 * catalog. Every provider-specific detail (auth scheme, rate limits,
 * response shape, deprecated endpoints, fallback preview sources) lives
 * behind this interface. Nothing outside `infrastructure/providers/*`
 * is allowed to import a provider SDK or know that Spotify exists.
 *
 * This is what lets us swap or supplement Spotify later (e.g. adding a
 * Deezer or iTunes adapter for preview-audio fallback) without touching
 * application services, routes, or the client.
 *
 * Implemented starting in Phase 2, once catalog browsing begins.
 */
export interface IMusicProvider {
  search(query: SearchQuery): Promise<SearchResult>;
  getArtist(id: string): Promise<Artist>;
  getArtistDiscography(id: string, releaseType: ReleaseType): Promise<Album[]>;
  getAlbum(id: string): Promise<Album>;
  getAlbumTracks(id: string): Promise<Track[]>;
  getTrack(id: string): Promise<Track>;
}
