import { type KeyboardEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavigableResultItem } from '../navigation/searchResultAdapters';

export function useResultListNavigation(items: NavigableResultItem[]) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveIndex(items.length > 0 ? 0 : -1);
  }, [items]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (items.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + items.length) % items.length);
        break;
      case 'Enter': {
        const activeItem = items[activeIndex];
        if (activeItem) {
          event.preventDefault();
          navigate(activeItem.href);
        }
        break;
      }
      default:
        break;
    }
  }

  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;

  return { activeIndex, activeDescendantId: activeItem?.domId, handleKeyDown };
}
