import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from './api';

export const fetchUpdates = async (limit = 20, offset = 0) => {
  const { data } = await api.get(`/getUpdates`, { params: { limit, offset } });
  return data;
};

export const fetchTitle = async (id: number) => {
  const { data } = await api.get('/getTitle', { params: { id } });
  return data;
};

export const searchTitles = async (q: string) => {
  const { data } = await api.get('/searchTitles', { params: { search: q } });
  return data;
};

/* React Query hooks */
export const useUpdates = (limit = 20) =>
  useInfiniteQuery({
    queryKey: ['updates', limit],
    queryFn: ({ pageParam = 0 }) => {
      console.log('Fetching updates with params:', { limit, pageParam });
      return fetchUpdates(limit, pageParam);
    },
    getNextPageParam: (lastPage: { next?: number }, pages: unknown[]) => {
      console.log('getNextPageParam called:', { lastPage, pagesLength: pages.length });
      // depends on API response shape — делаем безопасный fallback
      if (lastPage?.next) {
        console.log('Using next from lastPage:', lastPage.next);
        return lastPage.next;
      }
      if (Array.isArray(lastPage) && lastPage.length === limit) {
        const nextPageParam = pages.length * limit;
        console.log('Using calculated next page param:', nextPageParam);
        return nextPageParam;
      }
      console.log('No next page param available');
      return undefined;
    },
    staleTime: 1000 * 60 * 10, // Увеличено до 10 минут
    gcTime: 1000 * 60 * 60, // Кэшируем на 1 час
    initialPageParam: 0,
    refetchOnWindowFocus: false, // Отключаем автоматическую перезагрузку при фокусе окна
    refetchOnMount: false, // Отключаем перезагрузку при монтировании
    retry: (failureCount, error: { response?: { status: number } }) => {
      console.log('Retry attempt:', failureCount, error);
      // Не повторять запросы при ошибках
      if (error?.response?.status && error.response.status >= 500) return false;
      return failureCount < 2;
    },
    networkMode: 'online' // Только при онлайн соединении
  });

export const useTitle = (id?: number) =>
  useQuery({
    queryKey: ['title', id],
    queryFn: () => (id ? fetchTitle(id) : Promise.reject('no id')),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 2, // Увеличено до 2 часов
    gcTime: 1000 * 60 * 60 * 24, // Кэшируем на 24 часа
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

export const useSearch = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: () => (query ? searchTitles(query) : Promise.resolve([])),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 15, // Увеличено до 15 минут
    gcTime: 1000 * 60 * 60, // Кэшируем на 1 час
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData // Сохраняем предыдущие данные при новом запросе
  });