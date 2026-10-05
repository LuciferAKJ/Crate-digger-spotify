import { create } from 'zustand';

export interface SearchHistoryEntry {
  query: string;
  executedAt: number;
}

interface SearchHistoryState {
  entries: SearchHistoryEntry[];
  addQuery: (query: string) => void;
  clear: () => void;
}

const MAX_ENTRIES = 20;

export const useSearchHistoryStore = create<SearchHistoryState>((set) => ({
  entries: [],
  addQuery: (query) =>
    set((state) => {
      const trimmed = query.trim();
      if (!trimmed) {
        return state;
      }
      const withoutDuplicate = state.entries.filter((entry) => entry.query !== trimmed);
      const nextEntries = [{ query: trimmed, executedAt: Date.now() }, ...withoutDuplicate].slice(0, MAX_ENTRIES);
      return { entries: nextEntries };
    }),
  clear: () => set({ entries: [] }),
}));
