import type { Artist } from '@crate-digger/shared';
import { ResultListItem } from './ResultListItem';

interface ArtistResultCardProps {
  artist: Artist;
  domId: string;
  isActive: boolean;
}

export function ArtistResultCard({ artist, domId, isActive }: ArtistResultCardProps) {
  const image = artist.images[0];

  return (
    <ResultListItem id={domId} href={`/artist/${artist.id}`} isActive={isActive}>
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-bg-surface-2">
        {image && <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{artist.name}</p>
        <p className="truncate text-xs text-text-tertiary">Artist</p>
      </div>
    </ResultListItem>
  );
}
