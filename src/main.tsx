import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

// Global handlers — если есть runtime error до React mount, покажем alert + console
window.addEventListener('error', (ev) => {
  // покажем поверх страницы (если React не успел примонтироваться)
  try {
    console.error('window.error', ev.error || ev.message, ev);
    // Если document.body пуст — вставляем простой блок с ошибкой
    if (!document.getElementById('root') || !document.body.innerHTML.trim()) {
      document.body.innerHTML = `<pre style="white-space:pre-wrap;background:#2b2b2b;color:#fff;padding:20px;">Runtime error: ${String(
        ev.error?.message ?? ev.message
      )}\n\nSee console for details.</pre>`;
    }
  } catch {}
});

window.addEventListener('unhandledrejection', (ev) => {
  console.error('unhandledrejection', ev.reason);
  try {
    if (!document.getElementById('root') || !document.body.innerHTML.trim()) {
      document.body.innerHTML = `<pre style="white-space:pre-wrap;background:#2b2b2b;color:#fff;padding:20px;">Unhandled promise rejection: ${String(
        ev.reason
      )}\n\nSee console for details.</pre>`;
    }
  } catch {}
});

const rootEl = document.getElementById('root');
if (!rootEl) {
  // очень частая причина белого экрана — отсутствует div#root в index.html
  document.body.innerHTML =
    '<div style="padding:20px;background:#111;color:#fff;"><h2>Ошибка: элемент с id="root" не найден в index.html</h2><p>Проверьте index.html — должен быть <div id="root"></div>.</p></div>';
} else {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}