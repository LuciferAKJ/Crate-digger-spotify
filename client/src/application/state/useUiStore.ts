import { create } from 'zustand';

export type UiDensity = 'comfortable' | 'compact';

interface UiState {
  isSidebarCollapsed: boolean;
  density: UiDensity;
  toggleSidebar: () => void;
  setDensity: (density: UiDensity) => void;
}

/**
 * Deliberately narrow in Phase 1: only the shell-level state that the
 * layout (Part 6/7 responsive rules) needs to render. Favorites, dig
 * history, and the audio player each get their own store when their
 * phase introduces them — one store per bounded concern, not one
 * god-store for "app state".
 */
export const useUiStore = create<UiState>((set) => ({
  isSidebarCollapsed: false,
  density: 'comfortable',
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setDensity: (density) => set({ density }),
}));
