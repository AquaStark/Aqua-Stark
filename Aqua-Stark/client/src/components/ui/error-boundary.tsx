'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
          />
        );
      }

      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900'>
          <div className='bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4'>
            <div className='text-center'>
              <div className='text-red-400 text-6xl mb-4'>⚠️</div>
              <h2 className='text-white text-xl font-bold mb-4'>
                Algo salió mal
              </h2>
              <p className='text-gray-300 text-sm mb-6'>
                Ha ocurrido un error inesperado. Por favor, intenta recargar la
                página.
              </p>
              <div className='space-y-3'>
                <button
                  onClick={this.resetError}
                  className='w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className='w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
                >
                  Recargar página
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='mt-4 text-left'>
                  <summary className='text-gray-400 cursor-pointer text-sm'>
                    Detalles del error (solo desarrollo)
                  </summary>
                  <pre className='text-xs text-red-400 mt-2 p-2 bg-gray-900 rounded overflow-auto'>
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
