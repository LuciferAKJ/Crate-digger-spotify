import { History, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-subtle bg-bg-surface-1 px-8">
      <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
        <Sparkles className="h-5 w-5 text-accent-orange" aria-hidden="true" />
        Crate Digger
      </Link>

      <button
        type="button"
        onClick={() => navigate('/search')}
        aria-label="Open search (Cmd+K)"
        className="flex w-80 items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface-2 px-4 py-2 text-sm text-text-tertiary transition-colors hover:border-border-strong"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Search artists, albums, tracks...
        <kbd className="ml-auto rounded border border-border-subtle bg-bg-surface-1 px-1.5 py-0.5 font-mono text-xs text-text-secondary">
          ⌘K
        </kbd>
      </button>

      <nav className="flex items-center gap-4" aria-label="Quick access">
        <Link
          to="/history"
          aria-label="Dig history"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface-2 hover:text-text-primary"
        >
          <History className="h-5 w-5" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
