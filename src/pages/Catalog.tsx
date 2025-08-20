import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';
import { useUpdates } from '../services/titles';
import FiltersPanel from '../components/FiltersPanel';
import { useInView } from 'react-intersection-observer';
import SkeletonLoader from '../components/SkeletonLoader';
import { ErrorDisplay } from '../services/errorHandling';

const Catalog: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, error, isError, retry } = useUpdates(20);
  const { ref, inView } = useInView();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Реализация предзагрузки контента
  useEffect(() => {
    if (data) {
      const items = data?.pages.flatMap((p: any) => p.data ?? p) ?? [];
      // Предзагружаем первые 12 карточек
      const preloadCount = Math.min(12, items.length);
      for (let i = 0; i < preloadCount; i++) {
        setTimeout(() => {
          // TODO: Реализовать предзагрузку карточек
        }, i * 100);
      }
    }
  }, [data]);

  // Автоматическая загрузка при прокрутке
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  const items = data?.pages.flatMap((p: any) => p.data ?? p) ?? [];

  // Пример категорий
  const categories = [
    { id: 'all', name: 'Все', count: items.length },
    { id: 'action', name: 'Экшен', count: items.filter((t: { genres?: string[] }) => t.genres?.includes('Экшен')).length },
    { id: 'comedy', name: 'Комедия', count: items.filter((t: { genres?: string[] }) => t.genres?.includes('Комедия')).length },
    { id: 'drama', name: 'Драма', count: items.filter((t: { genres?: string[] }) => t.genres?.includes('Драма')).length },
    { id: 'fantasy', name: 'Фэнтези', count: items.filter((t: { genres?: string[] }) => t.genres?.includes('Фэнтези')).length },
    { id: 'romance', name: 'Романтика', count: items.filter((t: { genres?: string[] }) => t.genres?.includes('Романтика')).length },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Заголовок с градиентной заливкой */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Каталог аниме
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Исследуйте наш обширный каталог аниме - от классики до последних релизов
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковая панель с фильтрами */}
          <aside className="lg:w-80">
            <FiltersPanel />
            
            {/* Секции категорий */}
            <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                Категории
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                        : 'hover:bg-purple-500/10 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Основная сетка карточек */}
          <div className="flex-1">
            {isFetching && !data ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <SkeletonLoader type="card" />
                    <SkeletonLoader type="text" className="h-4 w-3/4" />
                    <SkeletonLoader type="text" className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ErrorDisplay
                  error={error}
                  onRetry={retry}
                  className="max-w-md"
                />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-white">Пусто</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    В каталоге пока нет аниме. Пожалуйста, зайдите позже.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                {items.map((t) => (
                  <AnimeCard
                    key={t.id}
                    title={t}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}

            {/* Индикатор загрузки */}
            <div ref={ref} className="h-16" />
            <div className="mt-12 text-center">
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  <span className="text-lg">Загрузка...</span>
                </div>
              ) : hasNextPage ? (
                <p className="text-gray-400 text-lg font-medium animate-pulse">
                  Прокрутите вниз для загрузки
                </p>
              ) : (
                <p className="text-gray-500 text-lg">
                  Больше нет данных
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Декоративный элемент */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-700"></div>
            <span className="text-sm font-medium">Наслаждайтесь просмотром</span>
            <div className="h-px w-16 bg-gradient-to-r from-gray-700 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catalog;