import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('does not update until the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'r' },
    });

    rerender({ value: 'radio' });
    expect(result.current).toBe('r');

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('r');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('radio');
  });

  it('resets the timer on rapid successive changes (only the final value settles)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'r' },
    });

    rerender({ value: 'ra' });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: 'rad' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('r');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('rad');
  });
});
