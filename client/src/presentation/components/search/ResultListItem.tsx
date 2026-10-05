import { type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@lib/cn';

interface ResultListItemProps extends PropsWithChildren {
  id: string;
  href: string;
  isActive: boolean;
}

export function ResultListItem({ id, href, isActive, children }: ResultListItemProps) {
  return (
    <Link
      id={id}
      to={href}
      role="option"
      aria-selected={isActive}
      className={cn(
        'flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-bg-surface-2',
        isActive && 'bg-bg-surface-2 ring-1 ring-accent-orange',
      )}
    >
      {children}
    </Link>
  );
}
