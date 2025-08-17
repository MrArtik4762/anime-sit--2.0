import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Title } from '../types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimeCardProps {
  title: Title;
  onRemove?: (id: number) => void;
  showRemoveButton?: boolean;
  index?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ 
  title, 
  onRemove, 
  showRemoveButton = false,
  index = 0 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const poster = useMemo(() => {
    return title.posters?.medium?.url ? `https://anilibria.top${title.posters.medium.url}` : '/placeholder.jpg';
  }, [title.posters?.medium?.url]);

  // Оптимизированная анимация появления с задержкой на основе индекса
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 + (index * 50));
    return () => clearTimeout(timer);
  }, [index]);

  // Оптимизированная предзагрузка изображений
  const prefetchPoster = useCallback(() => {
    if (prefetched || !title.posters?.medium?.url) return;
    
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
    
    prefetchTimeoutRef.current = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        setPrefetched(true);
      };
      img.onerror = () => {
        setError(true);
      };
      img.src = poster;
    }, 50);
  }, [prefetched, title.posters?.medium?.url, poster]);

  // Intersection Observer для ленивой загрузки изображений
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imageRef.current;
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        }
      },
      { rootMargin: '50px' }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    prefetchPoster();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
  };

  const handleImageLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleImageError = () => {
    setLoaded(false);
    setError(true);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(title.id);
    }
  };

  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  // Оптимизированные варианты анимации
  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        delay: index * 0.05 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  }), [index]);

  return (
    <motion.div
      className="relative group"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="exit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/title/${title.id}`}
        className="block"
        aria-label={title.names.ru || title.names.en || 'Title'}
      >
        <div
          className={`relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-500 ease-out ${
            isHovered ? 'scale-105 shadow-2xl border-white/20' : 'scale-100'
          }`}
        >
          <div className="relative w-full h-56 md:h-64 lg:h-72 bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Прелоадер */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
              </div>
            )}
            
            {/* Оптимизированное изображение */}
            <img
              ref={imageRef}
              data-src={poster}
              src={loaded ? poster : undefined}
              alt={title.names.ru || title.names.en || 'Title'}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Градиентная маска */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300" />
            
            {/* Кнопка удаления для избранного */}
            <AnimatePresence>
              {showRemoveButton && isHovered && (
                <motion.button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* Эффект при наведении */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Информация о карточке */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <h3 className="relative font-bold text-lg md:text-xl lg:text-2xl mb-2 truncate bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {title.names.ru || title.names.en}
              </h3>
              <p className="relative text-sm md:text-base text-gray-400 font-medium mb-1">
                Серии: {title.player?.episodes?.last ?? '—'}
              </p>
              {title.names.en && title.names.en !== title.names.ru && (
                <p className="relative text-xs text-gray-500 font-medium">
                  {title.names.en}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AnimeCard;