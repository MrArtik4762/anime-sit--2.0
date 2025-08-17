import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../utils/motion';
import LazyImage from './LazyImage';
import { Title } from '../types';

const AnimeCard: React.FC<{ title: Title; onClick?: () => void }> = ({ title, onClick }) => {
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
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const tapVariants = reduceMotion ? {} : {
    scale: 0.98
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
         className="group relative bg-white/70 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer transform-gpu transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-purple-500/20"
        onClick={onClick}
      >
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
            className={`w-full h-full object-cover ${reduceMotion ? '' : 'transition-transform duration-300 group-hover:scale-110'}`}
            onLoad={() => {}}
          />
          
          {/* Оверлей при hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent ${reduceMotion ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'}`} />
          
          {/* Название карточки */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 ${reduceMotion ? '' : 'transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'}`}>
            <h3 className={`font-semibold text-sm line-clamp-2 mb-2 ${reduceMotion ? '' : 'group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors'}`}>
              {title.names.ru || title.names.en}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-400">
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