import type { Track } from '@crate-digger/shared';
import { formatDuration } from '@lib/formatDuration';
import { ResultListItem } from './ResultListItem';

interface TrackResultCardProps {
  track: Track;
  domId: string;
  isActive: boolean;
}

export function TrackResultCard({ track, domId, isActive }: TrackResultCardProps) {
  const image = track.album.images[0];

  return (
    <ResultListItem id={domId} href={`/track/${track.id}`} isActive={isActive}>
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-surface-2">
        {image && <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">
          {track.name}
          {track.explicit && (
            <span
              aria-label="Explicit"
              className="ml-1.5 rounded bg-bg-surface-2 px-1 py-0.5 align-middle font-mono text-[10px] text-text-tertiary"
            >
              E
            </span>
          )}
        </p>
        <p className="truncate text-xs text-text-tertiary">{track.artists.map((a) => a.name).join(', ')}</p>
      </div>
      <span className="shrink-0 font-mono text-xs text-text-tertiary">{formatDuration(track.durationMs)}</span>
    </ResultListItem>
  );
}
