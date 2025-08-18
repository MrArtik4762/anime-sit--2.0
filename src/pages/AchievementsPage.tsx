import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Achievement from '../components/Achievement';
import { 
  TrophyIcon, 
  StarIcon, 
  LockClosedIcon, 
  ChartBarIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'comments' | 'favorites' | 'likes' | 'watching' | 'social';
  experience: number;
}

interface UserStats {
  level: number;
  experience: number;
  nextLevelExp: number;
  totalExp: number;
  commentsCount: number;
  favoritesCount: number;
  likesReceived: number;
  animeWatched: number;
}

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'comments' | 'favorites' | 'likes' | 'watching' | 'social'>('all');

  // Получение достижений пользователя
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?._id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/api/achievements/${user._id}`);
      return response.data;
    },
    enabled: !!user,
  });

  // Получение статистики пользователя
  const { data: userStats } = useQuery({
    queryKey: ['userStats', user?._id],
    queryFn: async () => {
      if (!user) return null;
      const response = await api.get(`/api/user/stats/${user._id}`);
      return response.data;
    },
    enabled: !!user,
  });

  const getFilteredAchievements = () => {
    if (activeCategory === 'all') return achievements;
    return achievements.filter((achievement: UserAchievement) => 
      achievement.category === activeCategory
    );
  };

  const getRarityStats = () => {
    const stats = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
      total: achievements.length
    };

    achievements.forEach((achievement: UserAchievement) => {
      if (achievement.unlocked) {
        stats[achievement.rarity]++;
      }
    });

    return stats;
  };

  const rarityStats = getRarityStats();

  const categories = [
    { key: 'all', label: 'Все', icon: TrophyIcon, color: 'text-purple-500' },
    { key: 'comments', label: 'Комментарии', icon: SparklesIcon, color: 'text-blue-500' },
    { key: 'favorites', label: 'Избранное', icon: StarIcon, color: 'text-yellow-500' },
    { key: 'likes', label: 'Лайки', icon: FireIcon, color: 'text-red-500' },
    { key: 'watching', label: 'Просмотр', icon: ChartBarIcon, color: 'text-green-500' },
    { key: 'social', label: 'Социальные', icon: TrophyIcon, color: 'text-purple-500' }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = unlockedCount > 0 ? (unlockedCount / achievements.length) * 100 : 0;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Войдите, чтобы увидеть достижения
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ваши достижения будут отображаться здесь после входа в систему
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Достижения
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Открывайте новые достижения за активность на сайте
        </p>
      </div>

      {/* Карточка уровня и прогресса */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <FireIcon className="w-8 h-8" />
              <span>Уровень {userStats?.level || 1}</span>
            </h2>
            <p className="text-purple-100">
              {userStats?.experience || 0} / {userStats?.nextLevelExp || 100} опыта
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {unlockedCount}/{achievements.length}
            </div>
            <p className="text-purple-100">достижений</p>
          </div>
        </div>
        
        <div className="w-full bg-purple-500/30 rounded-full h-3">
          <motion.div
            className="bg-white h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Статистика по редкости */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { 
            key: 'common', 
            label: 'Обычные', 
            value: rarityStats.common, 
            total: achievements.filter(a => a.rarity === 'common').length,
            color: 'from-gray-400 to-gray-600',
            icon: StarIcon
          },
          { 
            key: 'rare', 
            label: 'Редкие', 
            value: rarityStats.rare, 
            total: achievements.filter(a => a.rarity === 'rare').length,
            color: 'from-blue-400 to-blue-600',
            icon: StarIcon
          },
          { 
            key: 'epic', 
            label: 'Эпические', 
            value: rarityStats.epic, 
            total: achievements.filter(a => a.rarity === 'epic').length,
            color: 'from-purple-400 to-purple-600',
            icon: StarIcon
          },
          { 
            key: 'legendary', 
            label: 'Легендарные', 
            value: rarityStats.legendary, 
            total: achievements.filter(a => a.rarity === 'legendary').length,
            color: 'from-yellow-400 to-orange-500',
            icon: StarIcon
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <stat.icon className={`w-6 h-6 mb-2 text-gray-400`} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label} ({stat.total})
            </p>
          </motion.div>
        ))}
      </div>

      {/* Фильтры по категориям */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <motion.button
            key={category.key}
            onClick={() => setActiveCategory(category.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeCategory === category.key
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <category.icon className={`w-4 h-4 ${category.color}`} />
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Сетка достижений */}
      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            Достижения скоро появятся
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Начните активность на сайте, чтобы разблокировать первые достижения
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {getFilteredAchievements().map((achievement: UserAchievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <Achievement
                achievement={achievement}
                size="md"
                showProgress={!achievement.unlocked}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Подсказка о прогрессе */}
      {progressPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Продолжайте активность на сайте, чтобы разблокировать больше достижений!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementsPage;