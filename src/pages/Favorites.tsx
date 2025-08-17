import React, { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import AnimeCard from '../components/AnimeCard';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites: React.FC = () => {
  const { items, removeFavorite, addFavorite } = useFavorites();
  const [notification, setNotification] = useState<{message: string, type: 'add' | 'remove'} | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  // Предзагрузка контента
  useEffect(() => {
    if (items.length > 0) {
      const preloadCount = Math.min(12, items.length);
      for (let i = 0; i < preloadCount; i++) {
        setTimeout(() => {
          setVisibleCards(prev => new Set(prev).add(i));
        }, i * 100);
      }
    }
  }, [items]);

  // Показать уведомление
  const showNotification = (message: string, type: 'add' | 'remove') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Группировка по категориям
  const groupedFavorites = items.reduce((acc: Record<string, typeof items>, title) => {
    // Используем первый жанр для группировки или "Без категории"
    const category = title.genres?.[0] || 'Без категории';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(title);
    return acc;
  }, {});

  const categories = Object.keys(groupedFavorites).sort();

  // Варианты анимации для Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок с градиентной заливкой */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Избранное
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Ваши любимые аниме в одном месте - создайте персональную коллекцию
          </p>
        </div>

        {/* Уведомление */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg backdrop-blur-md bg-white/10 border border-white/20"
            >
              <p className={`font-medium ${
                notification.type === 'add'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {notification.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length === 0 ? (
          // Красивый пустой статус
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Ваша коллекция пуста
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Начните добавлять аниме в избранное, чтобы создать свою персональную коллекцию
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-pink-500/20">
              Перейти в каталог
            </button>
          </motion.div>
        ) : (
          // Группировка по категориям
          <div className="space-y-12">
            {categories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                    {category}
                  </h2>
                  <span className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-sm border border-white/10">
                    {groupedFavorites[category].length}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                  <AnimatePresence mode="popLayout">
                    {groupedFavorites[category].map((title, index) => (
                      <AnimeCard
                        key={title.id}
                        title={title}
                        index={index}
                        showRemoveButton={true}
                        onRemove={() => {
                          removeFavorite(title.id);
                          showNotification(`"${title.names.ru}" удалено из избранного`, 'remove');
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

export default Favorites;