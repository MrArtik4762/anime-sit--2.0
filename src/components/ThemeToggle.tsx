import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, getEffectiveTheme } = useTheme();
  const isDark = getEffectiveTheme() === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="glass w-12 h-6 rounded-full p-1 flex items-center justify-center relative transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Переключить тему"
      title={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
    >
      {/* Трек переключателя */}
      <div className="toggle-track w-10 h-4 rounded-full relative overflow-hidden">
        {/* Иконка Солнца (для светлой темы) */}
        <SunIcon
          className={`absolute top-0.5 left-0.5 w-4 h-4 transition-all duration-300 ${
            isDark ? 'opacity-0 translate-x-6 text-yellow-400' : 'opacity-100 translate-x-0 text-yellow-400'
          }`}
        />
        
        {/* Иконка Луны (для тёмной темы) */}
        <MoonIcon
          className={`absolute top-0.5 right-0.5 w-4 h-4 transition-all duration-300 ${
            isDark ? 'opacity-100 translate-x-0 text-white' : 'opacity-0 -translate-x-6 text-white'
          }`}
        />
        
        {/* Палец переключателя */}
        <div
          className={`toggle-thumb w-2 h-2 rounded-full absolute top-0.5 transition-all duration-300 ${
            isDark ? 'transform translate-x-6' : 'transform translate-x-0'
          }`}
          style={{
            background: 'var(--toggle-thumb)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;