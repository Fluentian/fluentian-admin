'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for catching React component errors
 * Prevents entire app from crashing when a component fails
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', info);
    }

    // TODO: Send error to error tracking service (Sentry, etc.)
    // logErrorToService(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8F7FC] px-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text-primary">Something went wrong</h1>
              <p className="text-text-secondary">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-sm font-mono text-red-600 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <Button
              onClick={this.handleReset}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components
 * Usage:
 * const [error, setError] = useErrorHandler();
 * try { ... } catch (e) { setError(e); }
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      console.error('Error:', error);
    }
  }, [error]);

  return [error, setError] as const;
}
