import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { useSearch } from '../services/titles';
import AnimeCard from '../components/AnimeCard';
import { StarIcon } from '@heroicons/react/24/outline';

const SearchPage: React.FC = () => {
  const [q, setQ] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debounced = useDebounce(q, 300);
  const { data, isLoading } = useSearch(debounced);

  const results = data ?? [];

  // Обработка кликов вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработка навигации с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < 9 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            setQ(results[selectedIndex].names?.ru || '');
            setShowSuggestions(false);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSuggestions, selectedIndex, results]);

  const handleSuggestionClick = (suggestion: any) => {
    setQ(suggestion.names?.ru || '');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQ(value);
    setSelectedIndex(-1);
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const formatSearchResults = () => {
    if (!q) return null;
    
    const genreMatches = results.filter(title =>
      title.genres?.some((genre: string) =>
        genre.toLowerCase().includes(q.toLowerCase())
      )
    );
    
    const titleMatches = results.filter(title =>
      !title.genres?.some((genre: string) =>
        genre.toLowerCase().includes(q.toLowerCase())
      )
    );

    return (
      <div className="space-y-4">
        {genreMatches.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              По жанрам "{q}"
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {genreMatches.map((title, index) => (
                <motion.div
                  key={title.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="cursor-pointer"
                  onClick={() => handleSuggestionClick(title)}
                >
                  <AnimeCard title={title} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {titleMatches.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              По названию "{q}"
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {titleMatches.map((title, index) => (
                <motion.div
                  key={title.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (genreMatches.length + index) * 0.05 }}
                  className="cursor-pointer"
                  onClick={() => handleSuggestionClick(title)}
                >
                  <AnimeCard title={title} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Поиск аниме
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Найдите любимые аниме по названию, жанру или году выпуска
        </p>
      </div>

      <div ref={searchRef} className="relative">
        <div className="relative">
          <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={(el) => {
              if (el) el.focus();
            }}
            value={q}
            onChange={handleInputChange}
            onFocus={() => q.length > 0 && setShowSuggestions(true)}
            className="w-full pl-10 pr-4 py-3 pl-10 rounded-lg bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 text-white placeholder-gray-500"
            placeholder="Поиск аниме..."
          />
        </div>

        <AnimatePresence>
          {showSuggestions && q.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden z-50 max-h-96"
            >
              {isLoading ? (
                <div className="p-4">
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-700 dark:bg-gray-600 rounded w-12 h-16" />
                          <div className="flex-1">
                            <div className="bg-gray-700 dark:bg-gray-600 h-4 rounded w-3/4 mb-2" />
                            <div className="bg-gray-700 dark:bg-gray-600 h-3 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {results.slice(0, 10).map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 hover:bg-gray-700 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        index === selectedIndex ? 'bg-gray-700 dark:bg-gray-800' : ''
                      }`}
                      onClick={() => handleSuggestionClick(result)}
                    >
                      <div className="flex items-center space-x-3">
                        {result.posters?.medium?.url && (
                          <img
                            src={result.posters.medium.url}
                            alt={result.names?.ru}
                            className="w-12 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">
                            {result.names?.ru || 'Без названия'}
                          </h4>
                          <p className="text-sm text-gray-400 truncate">
                            {result.names?.en || result.names?.jp || ''}
                          </p>
                          {result.year && (
                            <p className="text-xs text-gray-500">
                              {result.year} • {result.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  Ничего не найдено по запросу "{q}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        {q ? (
          formatSearchResults()
        ) : (
          <div className="text-center py-12">
            <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Начните поиск
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Введите название аниме, жанр или год выпуска для поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;