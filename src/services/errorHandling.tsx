import React from 'react';
import { useQuery, useInfiniteQuery, useMutation, UseQueryResult, UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ApiError } from './api';

// Тип для результата запроса с ошибкой
export interface QueryResult<T> extends Omit<UseQueryResult<T, ApiError>, 'error'> {
  error: ApiError | null;
  isError: boolean;
}

// Тип для результата бесконечного запроса с ошибкой
export interface InfiniteQueryResult<T> extends Omit<UseInfiniteQueryResult<T, ApiError>, 'error'> {
  error: ApiError | null;
  isError: boolean;
}

// Тип для результата мутации с ошибкой
export interface MutationResult<T> extends Omit<UseMutationResult<T, ApiError, any, any>, 'error'> {
  error: ApiError | null;
  isError: boolean;
}

// Кастомный хук для запросов с обработкой ошибок
export const useSafeQuery = <T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options?: {
    retry?: number;
    retryDelay?: number;
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
    placeholderData?: any;
    initialData?: T;
  }
): QueryResult<T> => {
  const result = useQuery({
    queryKey,
    queryFn,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
    ...options,
  });

  return {
    ...result,
    error: result.error || null,
    isError: !!result.error,
  };
};

// Кастомный хук для бесконечных запросов с обработкой ошибок
export const useSafeInfiniteQuery = <T>(
  queryKey: any[],
  queryFn: ({ pageParam }: { pageParam?: number }) => Promise<T>,
  options?: {
    getNextPageParam?: (lastPage: T, pages: T[]) => number | undefined;
    getPreviousPageParam?: (firstPage: T, pages: T[]) => number | undefined;
    retry?: number;
    retryDelay?: number;
    staleTime?: number;
    gcTime?: number;
    initialPageParam?: number;
    enabled?: boolean;
  }
): InfiniteQueryResult<T> => {
  const result = useInfiniteQuery({
    queryKey,
    queryFn,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
    ...options,
  });

  return {
    ...result,
    error: result.error || null,
    isError: !!result.error,
  };
};

// Кастомный хук для мутаций с обработкой ошибок
export const useSafeMutation = <T, V, N, C>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    onMutate?: (variables: V) => Promise<N | C> | N | C;
    onSuccess?: (data: T, variables: V, context: C | N | undefined) => void;
    onError?: (error: ApiError, variables: V, context: C | N | undefined) => void;
    onSettled?: (data: T | undefined, error: ApiError | null, variables: V, context: C | N | undefined) => void;
    retry?: number;
    retryDelay?: number;
  }
): MutationResult<T> => {
  const result = useMutation({
    mutationFn,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
    ...options,
  });

  return {
    ...result,
    error: result.error || null,
    isError: !!result.error,
  };
};


// Компонент для отображения ошибок
interface ErrorDisplayProps {
  error: ApiError | null;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Произошла ошибка
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error.message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Повторить попытку
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};