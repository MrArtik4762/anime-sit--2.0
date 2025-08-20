import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const readStoredTheme = (): Theme => {
  try {
    const v = localStorage.getItem('app-theme') as Theme | null;
    return v ?? 'system';
  } catch { return 'system'; }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  const applyTheme = useCallback((t: Theme, root: HTMLElement) => {
    // Удаляем классы темы
    root.classList.remove('light', 'dark', 'theme-transitioning');
    
    // Добавляем класс для предотвращения анимаций при смене темы
    root.classList.add('no-theme-transition');
    
    // Применяем новую тему
    if (t === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.add(t);
    }
    
    // Сохраняем текущую тему в localStorage
    try {
      localStorage.setItem('app-theme', t);
    } catch { /* ignore */ }
    
    // Удаляем класс предотвращения анимаций и добавляем плавную анимацию
    requestAnimationFrame(() => {
      root.classList.remove('no-theme-transition');
      requestAnimationFrame(() => {
        root.classList.add('theme-transitioning');
      });
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Инициализация темы без анимаций при первой загрузке
    if (!isInitialized) {
      const initialTheme = readStoredTheme();
      root.classList.remove('light', 'dark');
      
      if (initialTheme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.add(initialTheme);
      }
      
      setIsInitialized(true);
      return;
    }
    
    // Применяем тему с анимациями
    applyTheme(theme, root);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        applyTheme('system', root);
      }
    };
    
    // Используем современный API с fallback для старых браузеров
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      // Fallback для старых браузеров
      (mq as any).addListener(handler);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        // Fallback для старых браузеров
        (mq as any).removeListener(handler);
      }
    };
  }, [theme, isInitialized, applyTheme]);

  // Функция для переключения темы с анимацией
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  return { theme, setTheme, toggleTheme, isInitialized };
}