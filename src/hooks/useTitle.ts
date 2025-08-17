import { useEffect } from 'react';

/**
 * Устанавливает заголовок страницы
 * @param title Заголовок для установки
 */
export const useTitle = (title: string): void => {
  useEffect(() => {
    document.title = title;
    
    return () => {
      document.title = 'Аниме сайт'; // Возвращаем заголовок по умолчанию при размонтировании
    };
  }, [title]);
};