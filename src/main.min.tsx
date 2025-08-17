import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.min';

console.log('🚀 Запускаем минимальное приложение...');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ Минимальное приложение отрендерено');