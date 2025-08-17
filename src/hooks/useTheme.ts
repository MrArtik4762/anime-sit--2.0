import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const readStoredTheme = (): Theme => {
  try {
    const v = localStorage.getItem('app-theme') as Theme | null;
    return v ?? 'system';
  } catch { return 'system'; }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t: Theme) => {
      root.classList.remove('light', 'dark');
      if (t === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.add(t);
      }
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 420);
    };

    try { localStorage.setItem('app-theme', theme); } catch { /* ignore */ }
    applyTheme(theme);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);

    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, [theme]);

  return { theme, setTheme };
}