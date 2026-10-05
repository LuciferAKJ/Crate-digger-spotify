import type { Artist } from '@crate-digger/shared';
import type { IMusicProvider } from '../../domain/repositories/IMusicProvider.js';
import type { SearchCache } from '../../infrastructure/cache/SearchCache.js';

export class ArtistService {
  constructor(
    private readonly provider: IMusicProvider,
    private readonly cache?: SearchCache<Artist>,
  ) {}

  async getArtist(id: string): Promise<Artist> {
    const normalizedId = id.trim();
    if (this.cache) {
      const cached = this.cache.get(`artist:${normalizedId}`);
      if (cached) {
        return cached;
      }
    }

    const artist = await this.provider.getArtist(normalizedId);
    if (this.cache) {
      this.cache.set(`artist:${normalizedId}`, artist);
    }
    return artist;
  }
}
