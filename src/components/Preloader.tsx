import React, { useEffect, useState, useRef } from 'react';
import { usePrefersReducedMotion } from '../utils/motion';

const Preloader: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const resourceCheckTimerRef = useRef<number>();
  const imageLoadListenersRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Симуляция загрузки ресурсов
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Предотвращение преждевременного скрытия при быстрой загрузке
    const checkResources = () => {
      const images = document.images;
      let loaded = 0;
      const total = images.length;

      if (total === 0) {
        setIsLoading(false);
        return;
      }

      const checkAllLoaded = () => {
        if (loaded === total) {
          setIsLoading(false);
        }
      };

      // Очищаем предыдущие слушатели
      imageLoadListenersRef.current.forEach(listener => {
        Array.from(images).forEach(img => {
          img.removeEventListener('load', listener);
          img.removeEventListener('error', listener);
        });
      });
      imageLoadListenersRef.current = [];

      Array.from(images).forEach(img => {
        if (img.complete) {
          loaded++;
        } else {
          const imageLoadHandler = () => {
            loaded++;
            checkAllLoaded();
          };
          
          img.addEventListener('load', imageLoadHandler);
          img.addEventListener('error', imageLoadHandler);
          imageLoadListenersRef.current.push(imageLoadHandler);
        }
      });

      checkAllLoaded();
    };

    // Проверяем загруженные ресурсы после начальной задержки
    resourceCheckTimerRef.current = setTimeout(checkResources, 500);

    return () => {
      clearTimeout(timer);
      if (resourceCheckTimerRef.current) {
        clearTimeout(resourceCheckTimerRef.current);
      }
      // Очищаем все слушатели событий
      imageLoadListenersRef.current.forEach(listener => {
        const images = document.images;
        Array.from(images).forEach(img => {
          img.removeEventListener('load', listener);
          img.removeEventListener('error', listener);
        });
      });
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-sm">
      <div className="preloader-content">
        <div className="preloader-logo">
          <motion.div
            animate={!prefersReducedMotion ? {
              rotate: 360,
            } : {}}
            transition={!prefersReducedMotion ? {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            } : {}}
            className="relative"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-300 hover:scale-110"
            >
              {/* Внешний круг с градиентом */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="220"
                strokeDashoffset={prefersReducedMotion ? 220 : 0}
                className="opacity-20"
                style={!prefersReducedMotion ? {
                  strokeDashoffset: 0,
                  transition: 'stroke-dashoffset 2s ease-in-out'
                } : {}}
              />
              
              <circle
                cx="40"
                cy="40"
                r="25"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="157"
                strokeDashoffset={prefersReducedMotion ? 157 : 0}
                className="opacity-40"
                style={!prefersReducedMotion ? {
                  strokeDashoffset: 0,
                  transition: 'stroke-dashoffset 1.5s ease-in-out 0.2s'
                } : {}}
              />
              
              <circle
                cx="40"
                cy="40"
                r="15"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="94"
                strokeDashoffset={prefersReducedMotion ? 94 : 0}
                className="opacity-60"
                style={!prefersReducedMotion ? {
                  strokeDashoffset: 0,
                  transition: 'stroke-dashoffset 1s ease-in-out 0.4s'
                } : {}}
              />
              
              <circle
                cx="40"
                cy="40"
                r="5"
                fill="url(#gradient)"
                className={prefersReducedMotion ? '' : 'animate-pulse'}
              />
              
              {/* Анимированные точки */}
              {!prefersReducedMotion && (
                <>
                  <motion.circle
                    cx="40"
                    cy="5"
                    r="3"
                    fill="url(#gradient)"
                    animate={{ y: [5, 75, 5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="75"
                    cy="40"
                    r="3"
                    fill="url(#gradient)"
                    animate={{ x: [75, 5, 75] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                  <motion.circle
                    cx="40"
                    cy="75"
                    r="3"
                    fill="url(#gradient)"
                    animate={{ y: [75, 5, 75] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                  <motion.circle
                    cx="5"
                    cy="40"
                    r="3"
                    fill="url(#gradient)"
                    animate={{ x: [5, 75, 5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  />
                </>
              )}
            </svg>
          </motion.div>
        </div>
        <motion.h2
          className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.5 }}
        >
          AniStream
        </motion.h2>
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={!prefersReducedMotion ? {
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              } : {}}
              transition={!prefersReducedMotion ? {
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              } : {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;