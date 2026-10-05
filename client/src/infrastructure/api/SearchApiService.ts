import type { SearchQuery, SearchResult } from '@crate-digger/shared';
import { apiClient } from './FetchApiClient';
import type { IApiClient } from './IApiClient';

export interface ISearchApiService {
  search(query: SearchQuery, signal?: AbortSignal): Promise<SearchResult>;
}

export class SearchApiService implements ISearchApiService {
  constructor(private readonly apiClient: IApiClient) {}

  async search(query: SearchQuery, signal?: AbortSignal): Promise<SearchResult> {
    return this.apiClient.get<SearchResult>(
      '/search',
      {
        q: query.query,
        type: query.categories.join(','),
        limit: String(query.limit ?? 5),
        offset: String(query.offset ?? 0),
      },
      signal,
    );
  }
}

export const searchApiService = new SearchApiService(apiClient);
