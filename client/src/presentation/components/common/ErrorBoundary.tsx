import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

interface Props extends PropsWithChildren {
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * A safety net around subtrees that render third-party or unpredictable
 * content (album artwork processing, waveform rendering in later phases).
 * Route-level failures are handled separately via React Router's
 * `errorElement`, which this does not replace.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Rendering error caught by ErrorBoundary:', error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" className="p-6 text-sm text-text-secondary">
            Something went wrong displaying this section.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
