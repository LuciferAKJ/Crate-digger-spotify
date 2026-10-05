import { describe, expect, it } from 'vitest';
import { searchQueryKeys } from '../searchQueryKeys';

describe('searchQueryKeys.byQuery', () => {
  it('normalizes case/whitespace and category order into the same key', () => {
    const a = searchQueryKeys.byQuery('Radiohead', ['artist', 'album'], 5, 0);
    const b = searchQueryKeys.byQuery('  radiohead  ', ['album', 'artist'], 5, 0);
    expect(a).toEqual(b);
  });

  it('produces a different key for a different query', () => {
    const a = searchQueryKeys.byQuery('radiohead', ['artist'], 5, 0);
    const b = searchQueryKeys.byQuery('daft punk', ['artist'], 5, 0);
    expect(a).not.toEqual(b);
  });
});
