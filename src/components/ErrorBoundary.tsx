import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-container min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="error-icon mb-4">⚠️</div>
            <h1 className="error-title mb-2">Упс! Что-то пошло не так</h1>
            <p className="error-message mb-6">
              Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу 
              или вернуться на главную.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={this.handleReload}
                className="error-button transition-all duration-300 hover:scale-105"
              >
                Обновить страницу
              </button>
              <button 
                onClick={this.handleGoHome}
                className="error-button transition-all duration-300 hover:scale-105"
                style={{ 
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)'
                }}
              >
                На главную
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Техническая информация (для разработчиков)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                  <strong>Ошибка:</strong> {this.state.error.message}
                  <br />
                  <strong>Стек вызовов:</strong>
                  <br />
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;