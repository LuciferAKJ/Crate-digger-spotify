import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">404</span>
      <h1 className="font-display text-2xl font-bold">This crate is empty.</h1>
      <p className="text-sm text-text-secondary">Nothing lives at this address.</p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-accent-orange px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Crate Hub
      </Link>
    </div>
  );
}
