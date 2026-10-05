import { Play } from 'lucide-react';

export function PreviewBar() {
  return (
    <footer
      className="flex h-16 shrink-0 items-center gap-4 border-t border-border-subtle bg-bg-surface-1 px-8"
      aria-label="Audio preview player"
    >
      <button
        type="button"
        disabled
        aria-label="Play preview"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-surface-2 text-text-tertiary disabled:cursor-not-allowed"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center gap-3">
        <span className="text-sm text-text-tertiary">Nothing playing yet — start digging to preview a track.</span>
      </div>

      <div className="w-40 font-mono text-xs text-text-tertiary" aria-hidden="true">
        00:00 / 00:30
      </div>
    </footer>
  );
}
