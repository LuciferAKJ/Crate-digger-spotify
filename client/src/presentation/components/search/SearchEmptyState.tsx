import { PackageOpen, SearchX } from 'lucide-react';

interface SearchEmptyStateProps {
  variant: 'no-query' | 'no-results';
  query?: string;
}

export function SearchEmptyState({ variant, query }: SearchEmptyStateProps) {
  if (variant === 'no-query') {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <PackageOpen className="h-10 w-10 text-text-tertiary" aria-hidden="true" />
        <p className="text-sm text-text-secondary">Type an artist, album, or track to begin digging.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center" role="status">
      <SearchX className="h-10 w-10 text-text-tertiary" aria-hidden="true" />
      <p className="text-sm text-text-secondary">
        No results for <span className="text-text-primary">&ldquo;{query}&rdquo;</span>. Try a different spelling
        or a broader term.
      </p>
    </div>
  );
}
