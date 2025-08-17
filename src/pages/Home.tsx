import React, { useState, useEffect, useMemo } from 'react';
import { useUpdates } from '../services/titles';
import AnimeCard from '../components/AnimeCard';
import { useInView } from 'react-intersection-observer';

const Home: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUpdates(12);
  const { ref, inView } = useInView();
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  React.useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  // Предзагрузка контента
  useEffect(() => {
    if (data) {
      const items = data?.pages.flatMap((p: any) => p.data ?? p) ?? [];
      // Предзагружаем первые 12 карточек
      const preloadCount = Math.min(12, items.length);
      for (let i = 0; i < preloadCount; i++) {
        setTimeout(() => {
          setVisibleCards(prev => new Set(prev).add(i));
        }, i * 100);
      }
    }
  }, [data]);

  const items = data?.pages.flatMap((p: any) => p.data ?? p) ?? [];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок с градиентной заливкой */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Последние обновления
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Самые свежие аниме релизы и последние серии ваших любимых тайтлов
          </p>
        </div>

        {/* Сетка карточек с адаптивным layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
          {items.map((t: any, index: number) => (
            <div
              key={t.id}
              className={`transition-all duration-700 ease-out ${
                visibleCards.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <AnimeCard title={t} />
            </div>
          ))}
        </div>

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

export default Home;