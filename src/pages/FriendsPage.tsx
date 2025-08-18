import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, UserPlusIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import FriendButton from '../components/FriendButton';
import toast, { Toaster } from 'react-hot-toast';

interface Friend {
  _id: string;
  username: string;
  avatar: string;
  level?: number;
}

interface FriendRequest {
  _id: string;
  from: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
}

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends');

  // Получение списка друзей
  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?._id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/api/friends/${user._id}`);
      return response.data;
    },
    enabled: !!user,
  });

  // Получение входящих запросов в друзья
  const { data: incomingRequests = [] } = useQuery({
    queryKey: ['friendRequests', 'incoming', user?._id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/api/friends/requests/incoming/${user._id}`);
      return response.data;
    },
    enabled: !!user,
  });

  // Получение исходящих запросов в друзья
  const { data: outgoingRequests = [] } = useQuery({
    queryKey: ['friendRequests', 'outgoing', user?._id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/api/friends/requests/outgoing/${user._id}`);
      return response.data;
    },
    enabled: !!user,
  });

  // Получение рекомендаций друзей
  const { data: suggestions = [] } = useQuery({
    queryKey: ['friendSuggestions', user?._id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/api/friends/suggestions/${user._id}`);
      return response.data;
    },
    enabled: !!user,
  });

  const acceptRequest = async (requestId: string) => {
    await api.post(`/api/friends/accept/${requestId}`);
    toast.success('Запрос принят!');
    // Обновляем данные
    window.location.reload();
  };

  const rejectRequest = async (requestId: string) => {
    await api.delete(`/api/friends/request/${requestId}`);
    toast.success('Запрос отклонен');
    // Обновляем данные
    window.location.reload();
  };

  const cancelRequest = async (requestId: string) => {
    await api.delete(`/api/friends/request/${requestId}`);
    toast.success('Запрос отменен');
    // Обновляем данные
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`;
    return `${Math.floor(diffInMinutes / 1440)} дн назад`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Друзья
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управляйте списком друзей и запросами в друзья
        </p>
      </div>

      {/* Табы навигации */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {[
          { key: 'friends', label: 'Друзья', icon: UsersIcon, count: friends.length },
          { key: 'requests', label: 'Запросы', icon: ClockIcon, count: incomingRequests.length },
          { key: 'suggestions', label: 'Рекомендации', icon: UserPlusIcon, count: suggestions.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.key
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {tab.count > 9 ? '9+' : tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Контент табов */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        {activeTab === 'friends' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Ваши друзья ({friends.length})
            </h2>
            
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  У вас пока нет друзей
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Найдите друзей через рекомендации или добавьте пользователей в друзья
                </p>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Найти друзей
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend: Friend) => (
                  <motion.div
                    key={friend._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={friend.avatar || '/placeholder.jpg'}
                        alt={friend.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {friend.username}
                        </h3>
                        {friend.level && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Уровень {friend.level}
                          </p>
                        )}
                      </div>
                    </div>
                    <FriendButton targetUserId={friend._id} size="sm" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Запросы в друзья ({incomingRequests.length})
            </h2>
            
            {incomingRequests.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Нет входящих запросов
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Запросы от других пользователей будут отображаться здесь
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((request: FriendRequest) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.from.avatar || '/placeholder.jpg'}
                        alt={request.from.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {request.from.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => acceptRequest(request._id)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        title="Принять"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectRequest(request._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Отклонить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {outgoingRequests.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Исходящие запросы ({outgoingRequests.length})
                </h3>
                <div className="space-y-4">
                  {outgoingRequests.map((request: any) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={request.to.avatar || '/placeholder.jpg'}
                          alt={request.to.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {request.to.username}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => cancelRequest(request._id)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Отменить
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Рекомендации друзей ({suggestions.length})
            </h2>
            
            {suggestions.length === 0 ? (
              <div className="text-center py-12">
                <UserPlusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Нет рекомендаций
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Рекомендации появятся, когда вы начнете взаимодействовать с другими пользователями
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion: Friend) => (
                  <motion.div
                    key={suggestion._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={suggestion.avatar || '/placeholder.jpg'}
                        alt={suggestion.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {suggestion.username}
                        </h3>
                        {suggestion.level && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Уровень {suggestion.level}
                          </p>
                        )}
                      </div>
                    </div>
                    <FriendButton targetUserId={suggestion._id} size="sm" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <Toaster />
    </div>
  );
};

export default FriendsPage;