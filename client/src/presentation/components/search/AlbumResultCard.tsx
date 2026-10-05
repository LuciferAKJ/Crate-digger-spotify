import type { Album } from '@crate-digger/shared';
import { ResultListItem } from './ResultListItem';

interface AlbumResultCardProps {
  album: Album;
  domId: string;
  isActive: boolean;
}

export function AlbumResultCard({ album, domId, isActive }: AlbumResultCardProps) {
  const image = album.images[0];
  const releaseYear = album.releaseDate.slice(0, 4);

  return (
    <ResultListItem id={domId} href={`/album/${album.id}`} isActive={isActive}>
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-surface-2">
        {image && <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{album.name}</p>
        <p className="truncate text-xs text-text-tertiary">
          {album.artists.map((artist) => artist.name).join(', ')} · {releaseYear}
        </p>
      </div>
    </ResultListItem>
  );
}
