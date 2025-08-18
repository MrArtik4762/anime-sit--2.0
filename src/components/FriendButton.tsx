import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlusIcon, UserMinusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

interface FriendButtonProps {
  targetUserId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FriendButton: React.FC<FriendButtonProps> = ({ 
  targetUserId, 
  className = '',
  size = 'md'
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Получение данных о дружбе
  const { data: friendshipData } = useQuery({
    queryKey: ['friendship', user?._id, targetUserId],
    queryFn: async () => {
      if (!user || user._id === targetUserId) return null;
      const response = await api.get(`/api/friendship/${user._id}/${targetUserId}`);
      return response.data;
    },
    enabled: !!user && user._id !== targetUserId,
  });

  // Отправка запроса в друзья
  const sendFriendRequest = useMutation({
    mutationFn: async () => {
      await api.post('/api/friends/request', { targetUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      toast.success('Запрос в друзья отправлен!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при отправке запроса');
    }
  });

  // Принятие запроса в друзья
  const acceptFriendRequest = useMutation({
    mutationFn: async () => {
      await api.post('/api/friends/accept', { targetUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      toast.success('Вы теперь друзья!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при принятии запроса');
    }
  });

  // Отмена запроса в друзья
  const cancelFriendRequest = useMutation({
    mutationFn: async () => {
      await api.delete('/api/friends/request', { data: { targetUserId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      toast.success('Запрос отменен');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при отмене запроса');
    }
  });

  // Удаление из друзей
  const removeFriend = useMutation({
    mutationFn: async () => {
      await api.delete('/api/friends', { data: { targetUserId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      toast.success('Пользователь удален из друзей');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при удалении из друзей');
    }
  });

  // Отмена подписки
  const unfollowUser = useMutation({
    mutationFn: async () => {
      await api.delete('/api/follow', { data: { targetUserId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      toast.success('Вы отписались от пользователя');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при отписке');
    }
  });

  // Подписка на пользователя
  const followUser = useMutation({
    mutationFn: async () => {
      await api.post('/api/follow', { targetUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      toast.success('Вы подписались на пользователя');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка при подписке');
    }
  });

  if (!user || user._id === targetUserId) {
    return null;
  }

  const getFriendshipStatus = () => {
    if (!friendshipData) return 'none';
    
    if (friendshipData.isFriend) return 'friend';
    if (friendshipData.hasPendingRequest) return 'pending';
    if (friendshipData.isFollowing) return 'following';
    return 'none';
  };

  const status = getFriendshipStatus();

  const handleAction = (action: string) => {
    switch (action) {
      case 'send':
        sendFriendRequest.mutate();
        break;
      case 'accept':
        acceptFriendRequest.mutate();
        break;
      case 'cancel':
        cancelFriendRequest.mutate();
        break;
      case 'remove':
        removeFriend.mutate();
        break;
      case 'follow':
        followUser.mutate();
        break;
      case 'unfollow':
        unfollowUser.mutate();
        break;
    }
    setIsDropdownOpen(false);
  };

  const renderButton = () => {
    switch (status) {
      case 'friend':
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${sizeClasses[size]} bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${className}`}
          >
            <UserMinusIcon className="w-4 h-4" />
            <span>Друзья</span>
            <svg className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        );

      case 'pending':
        return (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`${sizeClasses[size]} bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${className}`}
            >
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                <span>В ожидании</span>
              </div>
              <svg className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        );

      case 'following':
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${sizeClasses[size]} bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${className}`}
          >
            <span>Подписан</span>
            <svg className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        );

      default:
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${sizeClasses[size]} bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ${className}`}
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Добавить</span>
            <svg className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        );
    }
  };

  return (
    <div className="relative">
      {renderButton()}
      
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          <div className="py-1">
            {status === 'friend' && (
              <>
                <button
                  onClick={() => handleAction('remove')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <UserMinusIcon className="w-4 h-4" />
                  <span>Удалить из друзей</span>
                </button>
                <button
                  onClick={() => handleAction('unfollow')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Отписаться</span>
                </button>
              </>
            )}
            
            {status === 'pending' && friendshipData?.isRequestFromMe && (
              <button
                onClick={() => handleAction('cancel')}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Отменить запрос</span>
              </button>
            )}
            
            {status === 'pending' && !friendshipData?.isRequestFromMe && (
              <>
                <button
                  onClick={() => handleAction('accept')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Принять</span>
                </button>
                <button
                  onClick={() => handleAction('cancel')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Отклонить</span>
                </button>
              </>
            )}
            
            {status === 'following' && (
              <>
                <button
                  onClick={() => handleAction('unfollow')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <UserMinusIcon className="w-4 h-4" />
                  <span>Отписаться</span>
                </button>
                <button
                  onClick={() => handleAction('send')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  <span>Добавить в друзья</span>
                </button>
              </>
            )}
            
            {status === 'none' && (
              <>
                <button
                  onClick={() => handleAction('send')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  <span>Добавить в друзья</span>
                </button>
                <button
                  onClick={() => handleAction('follow')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span>Подписаться</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
      
      <Toaster />
    </div>
  );
};

export default FriendButton;