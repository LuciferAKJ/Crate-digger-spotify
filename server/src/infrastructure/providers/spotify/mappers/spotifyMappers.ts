import type { Album, AlbumSummary, Artist, ArtistSummary, Image, ReleaseType, Track } from '@crate-digger/shared';
import type { SpotifyFullArtist, SpotifySimplifiedAlbum, SpotifyTrack } from '../schemas/spotifySchemas.js';

function mapImages(images: { url: string; width: number | null; height: number | null }[]): Image[] {
  return images.map((image) => ({ url: image.url, width: image.width, height: image.height }));
}

function mapArtistSummary(artist: { id: string; name: string }): ArtistSummary {
  return { id: artist.id, name: artist.name };
}

function mapReleaseType(albumType: 'album' | 'single' | 'compilation'): ReleaseType {
  return albumType;
}

export function mapSpotifyArtist(raw: SpotifyFullArtist): Artist {
  return {
    id: raw.id,
    name: raw.name,
    images: mapImages(raw.images),
    popularity: raw.popularity,
    genres: raw.genres,
    followerCount: raw.followers?.total ?? null,
  };
}

export function mapSpotifyAlbum(raw: SpotifySimplifiedAlbum): Album {
  return {
    id: raw.id,
    name: raw.name,
    images: mapImages(raw.images),
    releaseType: mapReleaseType(raw.album_type),
    releaseDate: raw.release_date,
    releaseDatePrecision: raw.release_date_precision,
    label: null,
    copyrightText: null,
    trackCount: raw.total_tracks,
    artists: raw.artists.map(mapArtistSummary),
    popularity: null,
  };
}

function mapAlbumSummary(raw: SpotifySimplifiedAlbum): AlbumSummary {
  return { id: raw.id, name: raw.name, images: mapImages(raw.images) };
}

export function mapSpotifyTrack(raw: SpotifyTrack): Track {
  return {
    id: raw.id,
    name: raw.name,
    trackNumber: raw.track_number,
    discNumber: raw.disc_number,
    durationMs: raw.duration_ms,
    explicit: raw.explicit,
    popularity: raw.popularity,
    previewUrl: raw.preview_url ?? null,
    album: mapAlbumSummary(raw.album),
    artists: raw.artists.map(mapArtistSummary),
  };
}
