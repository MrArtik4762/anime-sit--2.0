import React, { useState, useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '../utils/motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
  srcSet?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  srcSet
}) => {
  const reduceMotion = usePrefersReducedMotion();
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // CSS transition properties для изображений с учетом prefers-reduced-motion
  const imageTransitionProps = reduceMotion ? {
    duration: 0.1,
    filter: isLoaded ? 'none' : 'blur(0px)',
    transform: isLoaded ? 'none' : 'scale(1)'
  } : {
    duration: 0.3,
    filter: isLoaded ? 'none' : 'blur(5px)',
    transform: isLoaded ? 'none' : 'scale(1.05)'
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${reduceMotion ? '' : 'transition-all duration-300'} ${className}`}
      style={{
        background: hasError ? 'var(--bg-tertiary)' : 'transparent'
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        srcSet={srcSet ? `${srcSet.small} 640w, ${srcSet.medium} 1024w, ${srcSet.large} 1920w` : undefined}
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
        className={`lazy-image transition-all duration-300 ${
          isLoaded ? 'loaded' : 'loading'
        } ${hasError ? 'opacity-50' : ''}`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={imageTransitionProps}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
      )}
      
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${reduceMotion ? '' : 'animate-pulse'}`} />
      )}
    </div>
  );
};

export default LazyImage;