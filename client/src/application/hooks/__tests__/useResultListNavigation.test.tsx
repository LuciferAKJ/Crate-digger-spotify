import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useResultListNavigation } from '../useResultListNavigation';
import type { NavigableResultItem } from '../../navigation/searchResultAdapters';

const items: NavigableResultItem[] = [
  { id: '1', type: 'artist', href: '/artist/1', domId: 'd1' },
  { id: '2', type: 'album', href: '/album/2', domId: 'd2' },
];

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

function fakeKeyEvent(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as React.KeyboardEvent<HTMLInputElement>;
}

describe('useResultListNavigation', () => {
  it('starts on the first item once results arrive', () => {
    const { result } = renderHook(() => useResultListNavigation(items), { wrapper });
    expect(result.current.activeDescendantId).toBe('d1');
  });

  it('ArrowDown/ArrowUp wrap around the list', () => {
    const { result } = renderHook(() => useResultListNavigation(items), { wrapper });

    act(() => result.current.handleKeyDown(fakeKeyEvent('ArrowDown')));
    expect(result.current.activeDescendantId).toBe('d2');

    act(() => result.current.handleKeyDown(fakeKeyEvent('ArrowDown')));
    expect(result.current.activeDescendantId).toBe('d1'); // wraps
  });

  it('has no active item when the list is empty', () => {
    const { result } = renderHook(() => useResultListNavigation([]), { wrapper });
    expect(result.current.activeDescendantId).toBeUndefined();
  });
});
