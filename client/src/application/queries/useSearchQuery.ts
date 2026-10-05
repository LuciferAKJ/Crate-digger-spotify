import { useQuery } from '@tanstack/react-query';
import type { SearchCategory, SearchResult } from '@crate-digger/shared';
import { searchApiService } from '@infrastructure/api/SearchApiService';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { searchQueryKeys } from './searchQueryKeys';
import { shouldRetrySearchQuery } from './shouldRetrySearchQuery';

const DEBOUNCE_MS = 350;
const DEFAULT_CATEGORIES: SearchCategory[] = ['artist', 'album', 'track'];

interface UseSearchQueryOptions {
  categories?: SearchCategory[];
  limit?: number;
  offset?: number;
}

export function useSearchQuery(rawQuery: string, options: UseSearchQueryOptions = {}) {
  const { categories = DEFAULT_CATEGORIES, limit = 5, offset = 0 } = options;
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), DEBOUNCE_MS);
  const isQueryLongEnough = debouncedQuery.length > 0;

  const queryResult = useQuery<SearchResult>({
    queryKey: searchQueryKeys.byQuery(debouncedQuery, categories, limit, offset),
    queryFn: ({ signal }) => searchApiService.search({ query: debouncedQuery, categories, limit, offset }, signal),
    enabled: isQueryLongEnough,
    retry: shouldRetrySearchQuery,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...queryResult,
    isDebouncing: rawQuery.trim() !== debouncedQuery,
    hasQuery: isQueryLongEnough,
  };
}
