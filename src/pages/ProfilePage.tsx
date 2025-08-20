import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';
import AnimeCard from '../components/AnimeCard';
import { useTheme } from '../hooks/useTheme';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, uploadAvatar, getFavorites, getWatchLater } from '../services/api';
import { useSafeMutation, useSafeQuery, ErrorDisplay } from '../services/errorHandling';
import Favorites from './Favorites';
import FriendsPage from './FriendsPage';
import ActivityPage from './ActivityPage';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
}

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  theme: string;
  privacy: {
    profileVisible: boolean;
    favoritesVisible: boolean;
  };
  role: 'user' | 'admin';
  createdAt: string;
}

interface Favorite {
  _id: string;
  titleId: string;
  title: {
    id: string;
    names: {
      ru?: string | null;
      en?: string | null;
      jp?: string | null;
    };
    posters: {
      medium: {
        url: string;
      };
    };
  };
  createdAt: string;
}

interface WatchLater {
  _id: string;
  titleId: string;
  title: {
    id: string;
    names: {
      ru?: string | null;
      en?: string | null;
      jp?: string | null;
    };
    posters: {
      medium: {
        url: string;
      };
    };
  };
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [watchLater, setWatchLater] = useState<WatchLater[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    theme: 'system',
    profileVisible: true,
    favoritesVisible: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState<'favorites' | 'friends' | 'activity'>('favorites');
  
  // Хуки для запросов с обработкой ошибок
  const { data: favoritesData, error: favoritesError, isError: isFavoritesError, retry: retryFavorites } = useSafeQuery(
    ['favorites'],
    getFavorites,
    {
      enabled: !!user,
      retry: 1
    }
  );
  
  const { data: watchLaterData, error: watchLaterError, isError: isWatchLaterError, retry: retryWatchLater } = useSafeQuery(
    ['watchLater'],
    getWatchLater,
    {
      enabled: !!user,
      retry: 1
    }
  );
  
  const { mutate: updateProfileMutation, error: updateProfileError, isError: isUpdateProfileError } = useSafeMutation(
    updateProfile,
    {
      onSuccess: (data) => {
        // Обновляем пользователя в контексте аутентификации
        setIsEditing(false);
        setError(null);
      },
      onError: (error) => {
        setError(error.message);
      }
    }
  );
  
  const { mutate: uploadAvatarMutation, error: uploadAvatarError, isError: isUploadAvatarError } = useSafeMutation(
    uploadAvatar,
    {
      onSuccess: (data) => {
        setAvatarPreview('');
        setIsUploading(false);
        setError(null);
      },
      onError: (error) => {
        setError(error.message);
        setIsUploading(false);
      }
    }
  );

  // Варианты анимаций
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0.1 } : { duration: 0.3, ease: "easeOut" as const }
    }
  };

  // Загрузка данных профиля
  const fetchProfile = async () => {
    if (!user) return;
    
    setFormData({
      username: user.username,
      theme: user.theme,
      profileVisible: user.privacy.profileVisible,
      favoritesVisible: user.privacy.favoritesVisible
    });
  };

  // Обновление профиля
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation(formData);
  };

  // Загрузка аватара
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Предпросмотр аватара
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    uploadAvatarMutation(file);
  };

  // Форматируем дату
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Определяем активную вкладку на основе URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/profile/favorites')) {
      setActiveTab('favorites');
    } else if (path.includes('/profile/friends')) {
      setActiveTab('friends');
    } else if (path.includes('/profile/activity')) {
      setActiveTab('activity');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      // Устанавливаем данные из запросов
      if (favoritesData) {
        setFavorites(favoritesData);
      }
      if (watchLaterData) {
        setWatchLater(watchLaterData);
      }
    }
  }, [user, favoritesData, watchLaterData]);

  // Компонент для отображения контента активной вкладки
  const renderTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return <Favorites compact={true} />;
      case 'friends':
        return <FriendsPage compact={true} />;
      case 'activity':
        return <ActivityPage compact={true} />;
      default:
        return <Favorites compact={true} />;
    }
  };

  // Состояние загрузки
  const isLoading = authLoading || favoritesData === undefined || watchLaterData === undefined;

  // Объединяем все ошибки
  const allErrors = [
    favoritesError,
    watchLaterError,
    updateProfileError,
    uploadAvatarError
  ].filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Пожалуйста, войдите в свой аккаунт</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-6"
    >
      {/* Отображение ошибок */}
      {allErrors.length > 0 && (
        <div className="mb-6">
          {allErrors.map((error, index) => (
            <ErrorDisplay
              key={index}
              error={error}
              onRetry={() => {
                if (favoritesError) retryFavorites();
                if (watchLaterError) retryWatchLater();
              }}
              className="mb-2"
            />
          ))}
        </div>
      )}

      {/* Заголовок профиля */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Профиль пользователя
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управление вашим аккаунтом и персональными настройками
        </p>
      </motion.div>

      {/* Информация о пользователе */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Аватар и базовая информация */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={user.avatar === '/placeholder.jpg' ? '/placeholder.jpg' : user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_BASE_URL || 'https://api.anilibria.tv'}${user.avatar}`}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/20"
                />
                <label className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                {user.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {user.email}
              </p>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Зарегистрирован: {formatDate(user.createdAt)}</p>
              </div>

              {isUploading && (
                <div className="mt-4 text-sm text-purple-500">
                  Загрузка аватара...
                </div>
              )}

              {avatarPreview && (
                <div className="mt-4 text-sm text-green-500">
                  Предпросмотр нового аватара
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Настройки профиля */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Настройки профиля
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {isEditing ? 'Сохранить' : 'Редактировать'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Тема
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="light">Светлая</option>
                    <option value="dark">Тёмная</option>
                    <option value="system">Системная</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="profileVisible"
                      checked={formData.profileVisible}
                      onChange={(e) => setFormData({...formData, profileVisible: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="profileVisible" className="text-sm text-gray-700 dark:text-gray-300">
                      Сделать профиль видимым для других
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="favoritesVisible"
                      checked={formData.favoritesVisible}
                      onChange={(e) => setFormData({...formData, favoritesVisible: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="favoritesVisible" className="text-sm text-gray-700 dark:text-gray-300">
                      Показывать избранное в профиле
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Сохранить изменения
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Имя пользователя</p>
                  <p className="text-gray-800 dark:text-white">{user.username}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Тема</p>
                  <p className="text-gray-800 dark:text-white capitalize">{user.theme}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Приватность</p>
                  <div className="space-y-1">
                    <p className="text-gray-800 dark:text-white">
                      Профиль: {user.privacy.profileVisible ? 'Видимый' : 'Скрытый'}
                    </p>
                    <p className="text-gray-800 dark:text-white">
                      Избранное: {user.privacy.favoritesVisible ? 'Видимое' : 'Скрытое'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Вторичный таббар для профиля */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          {[
            { key: 'favorites', label: 'Избранное', icon: '❤️' },
            { key: 'friends', label: 'Друзья', icon: '👥' },
            { key: 'activity', label: 'Активность', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                navigate(`/profile/${tab.key}`);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Контент вкладок */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;