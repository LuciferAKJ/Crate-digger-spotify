import type { SearchQuery, SearchResult } from '@crate-digger/shared';
import type { IMusicProvider } from '../../domain/repositories/IMusicProvider.js';
import type { SearchCache } from '../../infrastructure/cache/SearchCache.js';

export class SearchService {
  constructor(
    private readonly provider: IMusicProvider,
    private readonly cache: SearchCache<SearchResult>,
  ) {}

  async search(query: SearchQuery): Promise<SearchResult> {
    const cacheKey = this.buildCacheKey(query);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.provider.search(query);
    this.cache.set(cacheKey, result);
    return result;
  }

  private buildCacheKey(query: SearchQuery): string {
    const normalizedQuery = query.query.trim().toLowerCase();
    const sortedCategories = [...query.categories].sort().join(',');
    return `search:${normalizedQuery}:${sortedCategories}:${query.limit ?? 5}:${query.offset ?? 0}`;
  }
}
