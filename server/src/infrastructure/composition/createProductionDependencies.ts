import { env } from '../config/env.js';
import { SpotifyAuthClient } from '../providers/spotify/SpotifyAuthClient.js';
import { SpotifyHttpClient } from '../providers/spotify/SpotifyHttpClient.js';
import { SpotifyMusicProvider } from '../providers/spotify/SpotifyMusicProvider.js';
import { SearchCache } from '../cache/SearchCache.js';
import { SearchService } from '../../application/services/SearchService.js';
import { ArtistService } from '../../application/services/ArtistService.js';
import type { Artist, SearchResult } from '@crate-digger/shared';

export interface AppDependencies {
  searchService: SearchService;
  artistService: ArtistService;
}

export function createProductionDependencies(): AppDependencies {
  const authClient = new SpotifyAuthClient(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const httpClient = new SpotifyHttpClient(authClient);
  const musicProvider = new SpotifyMusicProvider(httpClient);
  const searchCache = new SearchCache<SearchResult>();
  const searchService = new SearchService(musicProvider, searchCache);
  const artistCache = new SearchCache<Artist>();
  const artistService = new ArtistService(musicProvider, artistCache);
  return { searchService, artistService };
}
