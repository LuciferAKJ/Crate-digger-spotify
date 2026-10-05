import type { AlbumSummary } from './Album.js';
import type { ArtistSummary } from './Artist.js';

export interface Track {
  id: string;
  name: string;
  trackNumber: number;
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  popularity: number;
  /**
   * 30-second preview clip, if one could be sourced (from the provider or a
   * fallback source). Deliberately nullable: availability is inconsistent
   * across providers and must be handled as a first-class UI state, not an
   * edge case. See ADR-003 in the Phase 1 summary.
   */
  previewUrl: string | null;
  album: AlbumSummary;
  artists: ArtistSummary[];
}
