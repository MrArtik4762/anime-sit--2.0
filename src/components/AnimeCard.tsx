import React, { useState, useRef, useEffect } from 'react';
import { Title } from '../types';
import { Link } from 'react-router-dom';

const AnimeCard: React.FC<{ title: Title }> = ({ title }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const poster = title.posters?.medium?.url ? `https://anilibria.top${title.posters.medium.url}` : '/placeholder.jpg';

  const prefetchPoster = () => {
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
    }, 80);
  };

  const handleMouseEnter = () => {
    prefetchPoster();
  };

  const handleMouseLeave = () => {
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

  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      to={`/title/${title.id}`}
      className="block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="glass glass-outline rounded-xl overflow-hidden transition-all duration-300 hover-uplift fade-in-up">
        <div className="relative w-full h-44 md:h-52 bg-gray-700">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-700 animate-pulse" />
            </div>
          )}
          
          <img
            ref={imageRef}
            src={poster}
            alt={title.names.ru || title.names.en || 'Title'}
            className={`w-full h-full object-cover transition-all duration-300 ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          <div className="poster-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300" />
        </div>
        <div className="p-3" style={{
          '--text': 'var(--text)',
          '--muted': 'var(--muted)'
        } as React.CSSProperties}>
          <h3 className="font-bold text-white truncate" style={{ color: 'var(--text)' }}>
            {title.names.ru || title.names.en}
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Серии: {title.player?.episodes?.last ?? '—'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;