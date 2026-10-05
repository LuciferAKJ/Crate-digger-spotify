import type { SearchResult } from '@crate-digger/shared';
import { ArtistResultCard } from './ArtistResultCard';
import { AlbumResultCard } from './AlbumResultCard';
import { TrackResultCard } from './TrackResultCard';

interface SearchResultsGridProps {
  result: SearchResult;
  activeDescendantId?: string | undefined;
}

function isActive(domId: string, activeDescendantId?: string): boolean {
  return domId === activeDescendantId;
}

export function SearchResultsGrid({ result, activeDescendantId }: SearchResultsGridProps) {
  return (
    <div id="search-results-listbox" role="listbox" aria-label="Search results" className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <section aria-label="Artists">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Artists ({result.artists.total})
        </h2>
        <div className="flex flex-col gap-1">
          {result.artists.items.map((artist) => {
            const domId = `search-result-artist-${artist.id}`;
            return (
              <ArtistResultCard key={artist.id} artist={artist} domId={domId} isActive={isActive(domId, activeDescendantId)} />
            );
          })}
        </div>
      </section>

      <section aria-label="Albums">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Albums ({result.albums.total})
        </h2>
        <div className="flex flex-col gap-1">
          {result.albums.items.map((album) => {
            const domId = `search-result-album-${album.id}`;
            return (
              <AlbumResultCard key={album.id} album={album} domId={domId} isActive={isActive(domId, activeDescendantId)} />
            );
          })}
        </div>
      </section>

      <section aria-label="Tracks">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Tracks ({result.tracks.total})
        </h2>
        <div className="flex flex-col gap-1">
          {result.tracks.items.map((track) => {
            const domId = `search-result-track-${track.id}`;
            return (
              <TrackResultCard key={track.id} track={track} domId={domId} isActive={isActive(domId, activeDescendantId)} />
            );
          })}
        </div>
      </section>
    </div>
  );
}
