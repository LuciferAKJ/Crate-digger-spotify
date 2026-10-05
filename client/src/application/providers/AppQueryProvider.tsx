import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type JSX, type PropsWithChildren, useState } from 'react';

/**
 * Centralized cache/retry policy so individual queries (added in Phase 2)
 * don't each reinvent staleness and retry behavior. Catalog data (artists,
 * albums, tracks) is effectively immutable once released, so a generous
 * staleTime avoids redundant upstream calls.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function AppQueryProvider({ children }: PropsWithChildren): JSX.Element {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
