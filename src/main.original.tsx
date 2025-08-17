import React from 'react'
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log('🚀 main.tsx: Запускаем приложение...');

const queryClient = new QueryClient();

console.log('🔧 main.tsx: QueryClient создан');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

console.log('✅ main.tsx: Приложение отрендерено');