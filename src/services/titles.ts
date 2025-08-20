import { useSafeQuery, useSafeInfiniteQuery } from './errorHandling';
import api from './api';

export const fetchUpdates = async (limit = 20, offset = 0) => {
  const { data } = await api.get(`/v3/getUpdates`, {
    params: {
      limit,
      offset,
      filter: 'id,code,names,poster,seasons,genres,kind,series,episodes,favorite,status,updated'
    }
  });
  return data;
};

export const fetchTitle = async (id: number) => {
  const { data } = await api.get('/v3/title', {
    params: {
      id,
      filter: 'id,code,names,poster,seasons,genres,kind,series,episodes,favorite,status,updated'
    }
  });
  return data;
};

export const searchTitles = async (q: string) => {
  const { data } = await api.get('/v3/search', {
    params: {
      search: q,
      filter: 'id,code,names,poster,seasons,genres,kind,series,episodes,favorite,status,updated'
    }
  });
  return data;
};

/* React Query hooks с обработкой ошибок */
export const useUpdates = (limit = 20) => {
  const result = useSafeInfiniteQuery(
    ['updates', limit],
    ({ pageParam = 0 }) => {
      console.log('Fetching updates with params:', { limit, pageParam });
      return fetchUpdates(limit, pageParam);
    },
    {
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
      networkMode: 'online' // Только при онлайн соединении
    }
  );

  // Добавляем метод повторения запроса
  const retry = () => {
    console.log('Retrying updates fetch...');
    result.refetch();
  };

  // Добавляем логирование состояния
  console.log('useUpdates state:', {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    hasNextPage: result.hasNextPage,
    isFetching: result.isFetching,
    isFetchingNextPage: result.isFetchingNextPage
  });

  return {
    ...result,
    retry
  };
};

export const useTitle = (id?: number) => {
  const result = useSafeQuery(
    ['title', id],
    () => (id ? fetchTitle(id) : Promise.reject('no id')),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 60 * 2, // Увеличено до 2 часов
      gcTime: 1000 * 60 * 60 * 24, // Кэшируем на 24 часа
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  );

  // Добавляем метод повторения запроса
  const retry = () => {
    result.refetch();
  };

  return {
    ...result,
    retry
  };
};

export const useSearch = (query: string) => {
  const result = useSafeQuery(
    ['search', query],
    () => (query ? searchTitles(query) : Promise.resolve([])),
    {
      enabled: query.length > 0,
      staleTime: 1000 * 60 * 15, // Увеличено до 15 минут
      gcTime: 1000 * 60 * 60, // Кэшируем на 1 час
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      placeholderData: (previousData) => previousData // Сохраняем предыдущие данные при новом запросе
    }
  );

  // Добавляем метод повторения запроса
  const retry = () => {
    result.refetch();
  };

  return {
    ...result,
    retry
  };
};