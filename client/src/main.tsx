import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppQueryProvider } from '@application/providers/AppQueryProvider';
import { ErrorBoundary } from '@presentation/components/common/ErrorBoundary';
import { router } from '@presentation/routes/router';
import '@styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element (#root) not found — check index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AppQueryProvider>
        <RouterProvider router={router} />
      </AppQueryProvider>
    </ErrorBoundary>
  </StrictMode>,
);
