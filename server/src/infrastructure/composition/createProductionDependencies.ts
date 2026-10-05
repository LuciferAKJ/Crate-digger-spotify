import { env } from '../config/env.js';
import { SpotifyAuthClient } from '../providers/spotify/SpotifyAuthClient.js';
import { SpotifyHttpClient } from '../providers/spotify/SpotifyHttpClient.js';
import { SpotifyMusicProvider } from '../providers/spotify/SpotifyMusicProvider.js';
import { SearchCache } from '../cache/SearchCache.js';
import { SearchService } from '../../application/services/SearchService.js';
import type { SearchResult } from '@crate-digger/shared';

export interface AppDependencies {
  searchService: SearchService;
}

export function createProductionDependencies(): AppDependencies {
  const authClient = new SpotifyAuthClient(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const httpClient = new SpotifyHttpClient(authClient);
  const musicProvider = new SpotifyMusicProvider(httpClient);
  const searchCache = new SearchCache<SearchResult>();
  const searchService = new SearchService(musicProvider, searchCache);
  return { searchService };
}
