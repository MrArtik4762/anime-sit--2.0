import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  UserAddIcon, 
  TrophyIcon, 
  ClockIcon,
  FireIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'like' | 'comment' | 'friend_request' | 'achievement' | 'level_up';
  title: string;
  description: string;
  createdAt: string;
  relatedData?: {
    username?: string;
    animeTitle?: string;
    achievementTitle?: string;
    level?: number;
  };
}

const ActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month'>('all');

  // Получение активности пользователя
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity', user?._id, timeFilter],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/api/activity/${user._id}?filter=${timeFilter}`);
      return response.data;
    },
    enabled: !!user,
  });

  // Фильтрация активности по времени
  const filterActivities = () => {
    if (timeFilter === 'all') return activities;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    return activities.filter(activity => 
      new Date(activity.createdAt) >= filterDate
    );
  };

  const filteredActivities = filterActivities();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInHours < 24) return `${diffInHours} ч назад`;
    if (diffInDays < 7) return `${diffInDays} дн назад`;
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'like':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500" />;
      case 'friend_request':
        return <UserAddIcon className="w-5 h-5 text-green-500" />;
      case 'achievement':
        return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
      case 'level_up':
        return <FireIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'like':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'comment':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'friend_request':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'achievement':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'level_up':
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getActivityTitle = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'like':
        return activity.relatedData?.username 
          ? `Понравился комментарий от ${activity.relatedData.username}`
          : 'Вы поставили лайк';
      case 'comment':
        return activity.relatedData?.username 
          ? `Вы прокомментировали аниме "${activity.relatedData.animeTitle}"`
          : 'Вы оставили комментарий';
      case 'friend_request':
        return activity.relatedData?.username 
          ? `${activity.relatedData.username} отправил(а) запрос в друзья`
          : 'Запрос в друзья';
      case 'achievement':
        return `Получено достижение: ${activity.relatedData?.achievementTitle}`;
      case 'level_up':
        return `Поздравляем! Вы достигли уровня ${activity.relatedData?.level}`;
      default:
        return activity.title;
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'like':
        return activity.relatedData?.animeTitle 
          ? `В аниме "${activity.relatedData.animeTitle}"`
          : 'Комментарий получил лайк';
      case 'comment':
        return activity.relatedData?.animeTitle 
          ? `В разделе комментариев аниме "${activity.relatedData.animeTitle}"`
          : 'Вы оставили новый комментарий';
      case 'friend_request':
        return activity.relatedData?.username 
          ? `Принять или отклонить запрос от ${activity.relatedData.username}`
          : 'У вас новый запрос в друзья';
      case 'achievement':
        return activity.description;
      case 'level_up':
        return activity.description;
      default:
        return activity.description;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Войдите, чтобы увидеть свою активность
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ваша активность будет отображаться здесь после входа в систему
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Моя активность
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Последние действия и достижения на сайте
        </p>
      </div>

      {/* Фильтры по времени */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'all', label: 'Все' },
          { key: 'day', label: 'Сегодня' },
          { key: 'week', label: 'Неделя' },
          { key: 'month', label: 'Месяц' }
        ].map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => setTimeFilter(filter.key as any)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              timeFilter === filter.key
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Статистика активности */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: HeartIcon, label: 'Лайки', value: 0, color: 'text-red-500' },
          { icon: ChatBubbleLeftIcon, label: 'Комментарии', value: 0, color: 'text-blue-500' },
          { icon: UserAddIcon, label: 'Друзья', value: 0, color: 'text-green-500' },
          { icon: TrophyIcon, label: 'Достижения', value: 0, color: 'text-yellow-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Список активности */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <ArrowsRightLeftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Нет активности
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {timeFilter === 'all' 
                ? 'Вы еще не совершали никаких действий на сайте'
                : `За выбранный период (${timeFilter}) нет активности`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {getActivityTitle(activity)}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {getActivityDescription(activity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;