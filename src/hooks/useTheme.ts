import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    
    try {
      const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
      return storedTheme || 'system';
    } catch {
      return 'system';
    }
  });

  const [mounted, setMounted] = useState(false);

  // Инициализация и обработка системных предпочтений
  useEffect(() => {
    setMounted(true);
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      applyTheme('system');
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Применение темы к DOM
  const applyTheme = (currentTheme: Theme) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;
    
    // Добавляем класс для плавной анимации
    root.classList.add('theme-transition');
    
    // Применяем тему
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Удаляем класс анимации после завершения
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  };

  // Сохранение темы в localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    }
  }, [theme, mounted]);

  // Переключение между light и dark
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Установка конкретной темы
  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Получение текущей эффективной темы (с учетом системных настроек)
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  return {
    theme,
    mounted,
    toggleTheme,
    setTheme: setThemeMode,
    getEffectiveTheme
  };
};