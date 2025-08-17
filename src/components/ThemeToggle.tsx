import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, getEffectiveTheme } = useTheme();
  const isDark = getEffectiveTheme() === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full p-1 flex items-center justify-center transition-all duration-300 ease-in-out
                bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent
                hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      aria-label="Переключить тему"
      title={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
    >
      {/* Фоновый градиент для визуального эффекта */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
            : 'bg-gradient-to-r from-yellow-400 to-orange-400'
        }`} />
      </div>
      
      {/* Трек переключателя */}
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {/* Иконка Солнца (для светлой темы) */}
        <SunIcon
          className={`absolute top-1.5 left-2 w-5 h-5 z-10 transition-all duration-500 ease-in-out transform ${
            isDark
              ? 'opacity-0 translate-x-8 scale-90'
              : 'opacity-100 translate-x-0 scale-100 text-yellow-500'
          }`}
        />
        
        {/* Иконка Луны (для тёмной темы) */}
        <MoonIcon
          className={`absolute top-1.5 right-2 w-5 h-5 z-10 transition-all duration-500 ease-in-out transform ${
            isDark
              ? 'opacity-100 translate-x-0 scale-100 text-white'
              : 'opacity-0 -translate-x-8 scale-90'
          }`}
        />
        
        {/* Плавающий переключатель с красивым градиентом */}
        <div
          className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-500 ease-in-out transform z-20 shadow-md ${
            isDark ? 'translate-x-6' : 'translate-x-0'
          }`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Внутренний блеск для переключателя */}
          <div className="absolute inset-0 rounded-full bg-white opacity-30" />
        </div>
        
        {/* Декоративные элементы для визуального усиления */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <div className="w-1 h-1 rounded-full bg-yellow-400 opacity-60" />
          <div className="w-1 h-1 rounded-full bg-blue-400 opacity-60" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;