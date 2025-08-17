import React from 'react';

type State = { hasError: boolean; error?: Error | null; info?: React.ErrorInfo | null };

class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ error, info });
    try {
      // сохраняем для последующего анализа
      localStorage.setItem('lastAppError', JSON.stringify({ message: error.message, stack: error.stack, info }));
    } catch {}
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="p-6 bg-red-900 text-white min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Ошибка приложения — Debug</h1>
        <pre className="whitespace-pre-wrap overflow-auto text-sm" style={{ maxHeight: '70vh' }}>
          {this.state.error?.message}
          {'\n\n'}
          {this.state.error?.stack}
          {'\n\n'}
          {this.state.info ? JSON.stringify(this.state.info, null, 2) : ''}
        </pre>
        <div className="mt-4">
          <button onClick={() => location.reload()} className="px-3 py-2 rounded bg-primary">Перезагрузить</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;