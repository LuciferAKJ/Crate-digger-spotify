import { useEffect, useRef, useState } from 'react';
import { useSearchQuery } from '@application/queries/useSearchQuery';
import { useResultListNavigation } from '@application/hooks/useResultListNavigation';
import { flattenSearchResults } from '@application/navigation/searchResultAdapters';
import { useSearchHistoryStore } from '@application/state/useSearchHistoryStore';
import { SearchInput } from '@presentation/components/search/SearchInput';
import { SearchResultsGrid } from '@presentation/components/search/SearchResultsGrid';
import { SearchResultsSkeleton } from '@presentation/components/search/SearchResultsSkeleton';
import { SearchEmptyState } from '@presentation/components/search/SearchEmptyState';
import { SearchErrorState } from '@presentation/components/search/SearchErrorState';

export function SearchPage() {
  const [rawQuery, setRawQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addHistoryQuery = useSearchHistoryStore((state) => state.addQuery);

  const { data, isLoading, isError, error, isSuccess, hasQuery, refetch } = useSearchQuery(rawQuery);

  const items = data ? flattenSearchResults(data) : [];
  const { activeDescendantId, handleKeyDown } = useResultListNavigation(items);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isSuccess && hasQuery) {
      addHistoryQuery(rawQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hasQuery]);

  const totalResults = data ? data.artists.total + data.albums.total + data.tracks.total : 0;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <SearchInput
        ref={inputRef}
        value={rawQuery}
        onChange={setRawQuery}
        onKeyDown={handleKeyDown}
        activeDescendantId={activeDescendantId}
      />

      <div className="mt-8">
        {!hasQuery && <SearchEmptyState variant="no-query" />}

        {hasQuery && isLoading && <SearchResultsSkeleton />}

        {hasQuery && isError && <SearchErrorState error={error} onRetry={() => void refetch()} />}

        {hasQuery && !isLoading && !isError && data && totalResults === 0 && (
          <SearchEmptyState variant="no-results" query={rawQuery} />
        )}

        {hasQuery && !isLoading && !isError && data && totalResults > 0 && (
          <SearchResultsGrid result={data} activeDescendantId={activeDescendantId} />
        )}
      </div>
    </div>
  );
}
