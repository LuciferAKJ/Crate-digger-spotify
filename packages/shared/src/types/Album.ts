import type { ArtistSummary } from './Artist.js';
import type { Image } from './Image.js';

/** Maps to the Discography Matrix tabs in Part 3 of the design spec. */
export type ReleaseType = 'album' | 'single' | 'compilation' | 'appears_on';

export interface Album {
  id: string;
  name: string;
  images: Image[];
  releaseType: ReleaseType;
  /** ISO date string; precision varies by provider (year-only releases are common). */
  releaseDate: string;
  releaseDatePrecision: 'year' | 'month' | 'day';
  label: string | null;
  copyrightText: string | null;
  trackCount: number;
  artists: ArtistSummary[];
  popularity: number | null;
}

/** Lightweight album reference for embedding inside a Track. */
export interface AlbumSummary {
  id: string;
  name: string;
  images: Image[];
}
