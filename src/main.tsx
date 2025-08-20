import React from 'react'
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import { initCursorErrorHandler, cleanupCursorErrorHandler } from './utils/cursorErrorHandler';
import { Toaster } from 'react-hot-toast';
import './index.css';

console.log('🚀 main.tsx: Запускаем приложение...');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 2000,
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 30, // 30 минут
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 2,
      retryDelay: 2000,
    },
  },
});

console.log('🔧 main.tsx: QueryClient создан');

// Инициализация обработчика ошибок для курсора
console.log('🖱️ main.tsx: Инициализируем обработчик ошибок курсора...');
initCursorErrorHandler();
console.log('✅ main.tsx: Обработчик ошибок курсора инициализирован');

// Обработка очистки при размонтировании
const handleBeforeUnload = () => {
  console.log('🧹 main.tsx: Очищаем обработчик ошибок курсора...');
  cleanupCursorErrorHandler();
};

// Добавляем обработчики для очистки
window.addEventListener('beforeunload', handleBeforeUnload);
window.addEventListener('pagehide', handleBeforeUnload);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

console.log('✅ main.tsx: Приложение отрендерено');

// Очистка при завершении работы
const handleAppUnmount = () => {
  console.log('🧹 main.tsx: Приложение размонтируется, очищаем обработчики...');
  cleanupCursorErrorHandler();
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('pagehide', handleBeforeUnload);
};

// Добавляем обработчик для очистки при размонтировании приложения
if (typeof window !== 'undefined') {
  window.addEventListener('unload', handleAppUnmount);
}