import { describe, expect, it } from 'vitest';
import { mapSpotifyAlbum, mapSpotifyArtist, mapSpotifyTrack } from '../spotifyMappers.js';

describe('spotifyMappers', () => {
  it('maps a full artist, including Dev-Mode-removed fields as safe defaults', () => {
    const artist = mapSpotifyArtist({
      id: 'a1', name: 'Radiohead', images: [], popularity: 0, genres: [],
    });
    expect(artist).toEqual({ id: 'a1', name: 'Radiohead', images: [], popularity: 0, genres: [], followerCount: null });
  });

  it('maps followers.total when present', () => {
    const artist = mapSpotifyArtist({
      id: 'a1', name: 'X', images: [], popularity: 50, genres: ['rock'], followers: { total: 100 },
    });
    expect(artist.followerCount).toBe(100);
  });

  it('maps a simplified album from search results with label/popularity as null (never present on this shape)', () => {
    const album = mapSpotifyAlbum({
      id: 'al1', name: 'OK Computer', images: [], album_type: 'album',
      release_date: '1997-05-21', release_date_precision: 'day', total_tracks: 12,
      artists: [{ id: 'a1', name: 'Radiohead' }],
    });
    expect(album.label).toBeNull();
    expect(album.popularity).toBeNull();
    expect(album.releaseType).toBe('album');
    expect(album.artists).toEqual([{ id: 'a1', name: 'Radiohead' }]);
  });

  it('maps a track, defaulting previewUrl to null when absent (Dev Mode preview_url is frequently null)', () => {
    const track = mapSpotifyTrack({
      id: 't1', name: 'Paranoid Android', track_number: 2, disc_number: 1, duration_ms: 383000,
      explicit: false, popularity: 0,
      album: { id: 'al1', name: 'OK Computer', images: [], album_type: 'album', release_date: '1997', release_date_precision: 'year', total_tracks: 12, artists: [] },
      artists: [{ id: 'a1', name: 'Radiohead' }],
    });
    expect(track.previewUrl).toBeNull();
    expect(track.album.id).toBe('al1');
  });
});
