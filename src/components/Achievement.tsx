import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface Achievement {
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
}

interface AchievementProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const Achievement: React.FC<AchievementProps> = ({ 
  achievement, 
  size = 'md',
  showProgress = true 
}) => {
  const { user } = useAuth();

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg'
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const rarityBorderColors = {
    common: 'border-gray-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400'
  };

  const getProgressPercentage = () => {
    return Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  };

  const getRarityText = () => {
    switch (achievement.rarity) {
      case 'common': return 'Обычное';
      case 'rare': return 'Редкое';
      case 'epic': return 'Эпическое';
      case 'legendary': return 'Легендарное';
    }
  };

  const getCategoryIcon = () => {
    switch (achievement.category) {
      case 'comments': return '💬';
      case 'favorites': return '⭐';
      case 'likes': return '👍';
      case 'watching': return '📺';
      case 'social': return '👥';
      default: return '🏆';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!achievement.unlocked ? { scale: 1.05, y: -2 } : {}}
      className={`relative bg-gradient-to-br ${rarityColors[achievement.rarity]} rounded-lg p-1 shadow-lg ${
        achievement.unlocked ? 'opacity-100' : 'opacity-60'
      }`}
    >
      {/* Фон для залоченных достижений */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
          <LockClosedIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Основная карточка */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg h-full flex flex-col items-center justify-center p-2 ${
        achievement.unlocked ? 'border-2 ' + rarityBorderColors[achievement.rarity] : ''
      }`}>
        {/* Иконка достижения */}
        <div className={`${sizeClasses[size]} flex items-center justify-center mb-2`}>
          {achievement.unlocked ? (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrophyIcon className="w-full h-full text-yellow-500" />
            </motion.div>
          ) : (
            <TrophyIcon className="w-full h-full text-gray-400" />
          )}
        </div>

        {/* Прогресс */}
        {showProgress && !achievement.unlocked && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{achievement.currentProgress}/{achievement.requirement}</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Название и редкость */}
        <div className="text-center w-full">
          <h3 className={`font-bold truncate w-full ${
            achievement.unlocked 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {achievement.title}
          </h3>
          {size !== 'sm' && (
            <p className={`text-xs ${
              achievement.unlocked 
                ? 'text-gray-600 dark:text-gray-300' 
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {getRarityText()}
            </p>
          )}
        </div>

        {/* Анимация при получении */}
        {achievement.unlocked && achievement.unlockedAt && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2 -right-2"
          >
            <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
              <StarIcon className="w-3 h-3" />
              <span>+XP</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Подсказка при наведении */}
      {size !== 'sm' && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          <div className="font-semibold mb-1">{getCategoryIcon()} {achievement.title}</div>
          <div className="text-xs text-gray-300">{achievement.description}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </motion.div>
  );
};

export default Achievement;