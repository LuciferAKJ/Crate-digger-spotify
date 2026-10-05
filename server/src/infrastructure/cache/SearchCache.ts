import NodeCache from 'node-cache';

const DEFAULT_TTL_SECONDS = 300;

export class SearchCache<TValue extends object> {
  private readonly store: NodeCache;

  constructor(ttlSeconds: number = DEFAULT_TTL_SECONDS) {
    this.store = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 2, useClones: false });
  }

  get(key: string): TValue | undefined {
    return this.store.get<TValue>(key);
  }

  set(key: string, value: TValue): void {
    this.store.set(key, value);
  }
}
