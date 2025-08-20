import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUpdates } from '../services/titles';
import AnimeCard from '../components/AnimeCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePrefersReducedMotion } from '../utils/motion';
import { useTitle } from '../hooks/useTitle';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ErrorDisplay } from '../services/errorHandling';

// Варианты анимаций для staggered списка с учетом prefers-reduced-motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Варианты анимации для отдельной карточки с учетом prefers-reduced-motion
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Упрощенные варианты для prefers-reduced-motion
const reducedContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
  },
};

const reducedItemVariants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  useTitle('Аниме');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError, retry } = useUpdates(12);
  const reduceMotion = usePrefersReducedMotion();

  // Оптимизация с использованием useCallback и useMemo
  const items = useMemo(() => {
    return data?.pages.flatMap((p: any) => {
      // Если API возвращает массив данных напрямую
      if (Array.isArray(p)) {
        return p;
      }
      // Если API возвращает объект с полем data
      if (p?.data && Array.isArray(p.data)) {
        return p.data;
      }
      // Fallback для других случаев
      console.warn('Unexpected page structure:', p);
      return [];
    }) ?? [];
  }, [data]);

  // Состояние для отображения скелетонов при первой загрузке
  const [showSkeletons, setShowSkeletons] = useState(true);

  // Скрытие скелетонов после первой загрузки данных
  useEffect(() => {
    if (items.length > 0 && showSkeletons) {
      const timer = setTimeout(() => {
        setShowSkeletons(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [items.length, showSkeletons]);

  // Оптимизированный обработчик загрузки следующей страницы
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Отображение скелетонов при первой загрузке
  const renderSkeletons = () => {
    if (!showSkeletons) return null;
    return Array.from({ length: 12 }).map((_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        variants={reduceMotion ? reducedItemVariants : itemVariants}
        className="w-full"
      >
        <SkeletonLoader type="card" className="w-full" />
      </motion.div>
    ));
  };

  // Отображение карточек аниме
  const renderAnimeCards = () => {
    return items.map((t: { id: number; names: { ru?: string; en?: string }; year: number; type: string; posters?: { medium?: { url?: string }; small?: { url?: string } } }) => (
      <motion.div key={t.id} variants={reduceMotion ? reducedItemVariants : itemVariants}>
        <AnimeCard title={t as any} />
      </motion.div>
    ));
  };

  if (items.length === 0 && !showSkeletons) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Отображение ошибки */}
        {isError && (
          <div className="mb-8">
            <ErrorDisplay
              error={error}
              onRetry={retry}
              className="mb-6"
            />
          </div>
        )}

        {/* Заголовок с градиентной заливкой */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Последние обновления
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Самые свежие аниме релизы и последние серии ваших любимых тайтлов
          </p>
        </div>

        {/* InfiniteScroll компонент */}
        <InfiniteScroll
          dataLength={items.length}
          next={handleLoadMore}
          hasMore={hasNextPage}
          loader={
            <div className="flex items-center justify-center space-x-2 text-gray-400 my-8">
              <div className={`${reduceMotion ? '' : 'animate-spin'} rounded-full h-6 w-6 border-b-2 border-purple-500`}></div>
              <span className="text-lg">Загрузка...</span>
            </div>
          }
          endMessage={
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Больше нет данных</p>
            </div>
          }
          scrollThreshold={0.8}
          scrollableTarget="scrollable-div"
        >
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
            variants={reduceMotion ? reducedContainerVariants : containerVariants}
            initial="hidden"
            animate="show"
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            {showSkeletons ? renderSkeletons() : renderAnimeCards()}
          </motion.div>
        </InfiniteScroll>

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