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
    queryFn: ({ pageParam = 0 }) => fetchUpdates(limit, pageParam),
    getNextPageParam: (lastPage: any, pages: any) => {
      // depends on API response shape — делаем безопасный fallback
      if (lastPage?.next) return lastPage.next;
      if (lastPage?.length === limit) return pages.length * limit;
      return undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 min
    initialPageParam: 0
  });

export const useTitle = (id?: number) =>
  useQuery({
    queryKey: ['title', id],
    queryFn: () => (id ? fetchTitle(id) : Promise.reject('no id')),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    retry: false
  });

export const useSearch = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: () => (query ? searchTitles(query) : Promise.resolve([])),
    enabled: query.length > 0,
    staleTime: 1000 * 30,
    retry: false
  });