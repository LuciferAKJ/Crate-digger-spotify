import { Compass, Disc3, Heart, History, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@lib/cn';
import { useUiStore } from '@application/state/useUiStore';

const primaryNavItems = [
  { to: '/', label: 'Home', icon: Disc3, end: true },
  { to: '/search', label: 'Discover', icon: Compass, end: false },
  { to: '/favorites', label: 'My Crate', icon: Heart, end: false },
  { to: '/history', label: 'History', icon: History, end: false },
];

/** Placeholder shortcuts — sourced from the catalog once Phase 2/3 land. */
const genreCrates = ['Jazz', 'Soul', 'Electronic', 'Ambient'];

export function Sidebar() {
  const isCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-border-subtle bg-bg-surface-1 py-6 transition-[width] duration-[350ms] ease-premium',
        isCollapsed ? 'w-16 items-center px-2' : 'w-60 px-4',
      )}
    >
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {primaryNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-surface-2 hover:text-text-primary',
                isActive && 'bg-bg-surface-2 text-text-primary',
                isCollapsed && 'justify-center px-0',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!isCollapsed && label}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="mt-8">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Genre Crates
          </h2>
          <ul className="mt-2 flex flex-col gap-1">
            {genreCrates.map((genre) => (
              <li key={genre}>
                <span className="block cursor-not-allowed rounded-lg px-3 py-1.5 text-sm text-text-tertiary">
                  {genre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="mt-auto flex items-center justify-center rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-surface-2 hover:text-text-primary"
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
        ) : (
          <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </aside>
  );
}
