import type { Image } from './Image.js';

/**
 * A music artist, normalized from whatever upstream provider supplied it.
 * This shape is provider-agnostic by design — it must never leak
 * Spotify-specific fields (e.g. `external_urls`, `href`) into the rest
 * of the application. Provider adapters are responsible for mapping
 * their raw responses onto this contract.
 */
export interface Artist {
  id: string;
  name: string;
  images: Image[];
  /** 0–100 provider popularity score, used to drive the popularity gauge. */
  popularity: number;
  genres: string[];
  followerCount: number | null;
}

/** Minimal artist reference, used when embedding an artist inside another entity (e.g. Album.artists). */
export interface ArtistSummary {
  id: string;
  name: string;
}
