import type { Album, Artist, SearchResult, Track } from '@crate-digger/shared';

export interface NavigableResultItem {
  id: string;
  type: 'artist' | 'album' | 'track';
  href: string;
  domId: string;
}

function toArtistItem(artist: Artist): NavigableResultItem {
  return { id: artist.id, type: 'artist', href: `/artist/${artist.id}`, domId: `search-result-artist-${artist.id}` };
}

function toAlbumItem(album: Album): NavigableResultItem {
  return { id: album.id, type: 'album', href: `/album/${album.id}`, domId: `search-result-album-${album.id}` };
}

function toTrackItem(track: Track): NavigableResultItem {
  return { id: track.id, type: 'track', href: `/track/${track.id}`, domId: `search-result-track-${track.id}` };
}

/**
 * Flattens the category-partitioned `SearchResult` into a single ordered
 * list (artists, then albums, then tracks) for keyboard navigation.
 * Lives in `application/` (not `presentation/`) because
 * `useResultListNavigation` — also application-layer — depends on this
 * shape; presentation components depend on application, never the other
 * way around.
 */
export function flattenSearchResults(result: SearchResult): NavigableResultItem[] {
  return [
    ...result.artists.items.map(toArtistItem),
    ...result.albums.items.map(toAlbumItem),
    ...result.tracks.items.map(toTrackItem),
  ];
}
