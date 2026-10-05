import { AlertTriangle } from 'lucide-react';
import { ApiError } from '@infrastructure/api/IApiClient';

interface SearchErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.payload.code === 'RATE_LIMITED' && error.payload.retryAfterSeconds) {
      return `${error.payload.message} (try again in ${error.payload.retryAfterSeconds}s)`;
    }
    return error.payload.message;
  }
  return 'Something went wrong while searching.';
}

export function SearchErrorState({ error, onRetry }: SearchErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-accent-orange" aria-hidden="true" />
      <p className="text-sm text-text-secondary">{describeError(error)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-accent-orange px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
