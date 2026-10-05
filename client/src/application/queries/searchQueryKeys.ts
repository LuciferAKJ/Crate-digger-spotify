import type { SearchCategory } from '@crate-digger/shared';

export const searchQueryKeys = {
  all: ['search'] as const,
  byQuery: (query: string, categories: SearchCategory[], limit: number, offset: number) =>
    [...searchQueryKeys.all, { query: query.trim().toLowerCase(), categories: [...categories].sort(), limit, offset }] as const,
};
