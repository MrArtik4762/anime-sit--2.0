import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../utils/motion';
import LazyImage from './LazyImage';
import { Title } from '../types';

const AnimeCard: React.FC<{
  title: Title;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}> = ({ title, onClick, isFavorite = false, onToggleFavorite }) => {
  const reduceMotion = usePrefersReducedMotion();
  
  // URL изображения
  const poster = title.posters?.medium?.url ? `https://anilibria.top${title.posters.medium.url}` : '/placeholder.jpg';
  const posterSmall = title.posters?.small?.url ? `https://anilibria.top${title.posters.small.url}` : '/placeholder.jpg';
  
  const prefetchRef = useRef<HTMLImageElement | null>(null);

  const prefetch = useCallback(() => {
    if (prefetchRef.current) return;
    const img = new Image();
    img.src = poster;
    img.onload = () => { prefetchRef.current = img; };
    img.onerror = () => {};
  }, [poster]);

  // Варианты анимаций для карточки с учетом prefers-reduced-motion
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 20,
      scale: reduceMotion ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: reduceMotion ? 0 : -20
    }
  };

  // Hover эффекты с учетом prefers-reduced-motion
  const hoverVariants = reduceMotion ? {} : {
    y: -10,
    scale: 1.03,
    boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(147, 51, 234, 0.2)'
  };

  const tapVariants = reduceMotion ? {} : {
    scale: 0.97
  };

  // Анимация для кнопки избранного
  const favoriteButtonVariants = reduceMotion ? {} : {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  };

  // CSS transition properties для элементов
  const transitionProps = reduceMotion ? {
    duration: 0.1
  } : {
    duration: 0.3,
    ease: "easeOut"
  };

  return (
    <Link to={`/title/${title.id}`} onMouseEnter={prefetch} className="block">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={hoverVariants}
        whileTap={tapVariants}
        transition={transitionProps}
         className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer transform-gpu transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-500/30 border border-gray-200/50 dark:border-gray-700/50"
        onClick={onClick}
      >
        {/* Кнопка избранного */}
        <AnimatePresence>
          {onToggleFavorite && (
            <motion.button
              variants={favoriteButtonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(title.id);
              }}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm ${
                isFavorite
                  ? 'bg-red-500/90 text-white hover:bg-red-600/90'
                  : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:bg-white/95 dark:hover:bg-gray-950/95'
              } transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl`}
              aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              whileHover={!reduceMotion ? { scale: 1.1 } : {}}
              whileTap={!reduceMotion ? { scale: 0.9 } : {}}
            >
              <svg
                className={`w-5 h-5 ${reduceMotion ? '' : 'transition-transform duration-300'}`}
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Lazy загружаемое изображение */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <LazyImage
            src={posterSmall}
            srcSet={{
              small: posterSmall,
              medium: poster,
              large: poster
            }}
            alt={title.names.ru || title.names.en || 'Аниме'}
            className={`w-full h-full object-cover ${reduceMotion ? '' : 'transition-transform duration-500 group-hover:scale-115'}`}
            onLoad={() => {}}
          />
          
          {/* Оверлей при hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent ${reduceMotion ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'}`} />
          
          {/* Название карточки */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 ${reduceMotion ? '' : 'transform translate-y-full group-hover:translate-y-0 transition-transform duration-500'}`}>
            <h3 className={`font-semibold text-sm line-clamp-2 mb-2 ${reduceMotion ? '' : 'group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300'}`}>
              {title.names.ru || title.names.en}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{title.year}</span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                {String(title.type)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default AnimeCard;