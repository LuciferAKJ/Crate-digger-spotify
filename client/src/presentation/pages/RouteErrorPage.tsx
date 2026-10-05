import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'An unexpected error occurred.';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">Record Crate Locked</p>
      <h1 className="font-display text-2xl font-bold">{message}</h1>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-accent-orange px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Return to Safe Hub
      </Link>
    </div>
  );
}
