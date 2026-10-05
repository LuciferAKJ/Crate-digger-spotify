import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Phase 2 scope deliberately stops at "navigate to /search and focus the
 * input" (which `SearchPage` already does on mount) rather than building
 * a full Cmd+K overlay modal — that's UI polish the Phase 2 brief
 * explicitly excludes. This hook is the foundation a future overlay
 * would replace or build on.
 */
export function useGlobalSearchShortcut(): void {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isSearchShortcut) {
        return;
      }
      event.preventDefault();
      navigate('/search');
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
