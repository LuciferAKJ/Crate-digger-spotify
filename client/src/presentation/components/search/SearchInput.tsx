import { Search, X } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, forwardRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  activeDescendantId?: string | undefined;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, onKeyDown, activeDescendantId },
  ref,
) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange(event.target.value);
  }

  return (
    <div className="relative flex items-center">
      <Search className="pointer-events-none absolute left-4 h-4 w-4 text-text-tertiary" aria-hidden="true" />
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="search-results-listbox"
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
        aria-label="Search artists, albums, and tracks"
        placeholder="Search artists, albums, tracks..."
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className="w-full rounded-xl border border-border-subtle bg-bg-surface-2 py-3.5 pl-11 pr-11 text-base text-text-primary placeholder:text-text-tertiary focus:border-accent-orange"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 rounded-full p-1.5 text-text-tertiary transition-colors hover:bg-bg-surface-1 hover:text-text-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});
