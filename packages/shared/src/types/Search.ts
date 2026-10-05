import type { Album } from './Album.js';
import type { Artist } from './Artist.js';
import type { Track } from './Track.js';

export type SearchCategory = 'artist' | 'album' | 'track';

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/** Aggregate, category-partitioned result for the Cmd+K global search (Part 5.2). */
export interface SearchResult {
  artists: Paged<Artist>;
  albums: Paged<Album>;
  tracks: Paged<Track>;
}

export interface SearchQuery {
  query: string;
  categories: SearchCategory[];
  limit?: number;
  offset?: number;
}
