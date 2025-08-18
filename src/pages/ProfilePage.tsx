import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';
import AnimeCard from '../components/AnimeCard';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

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
  createdAt: string;
}

interface Favorite {
  _id: string;
  titleId: number;
  title: {
    id: number;
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
  titleId: number;
  title: {
    id: number;
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
  
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [watchLater, setWatchLater] = useState<WatchLater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    theme: 'system',
    profileVisible: true,
    favoritesVisible: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

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
      transition: reduceMotion ? { duration: 0.1 } : { duration: 0.3 }
    }
  };

  // Загрузка данных профиля
  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        credentials: 'include'
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const userData = await response.json();
      setUser(userData);
      setFormData({
        username: userData.username,
        theme: userData.theme,
        profileVisible: userData.privacy.profileVisible,
        favoritesVisible: userData.privacy.favoritesVisible
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка избранного
  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/favorites', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const favoritesData = await response.json();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  // Загрузка "Смотреть позже"
  const fetchWatchLater = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/watchlater', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch watch later');
      }

      const watchLaterData = await response.json();
      setWatchLater(watchLaterData);
    } catch (err) {
      console.error('Error fetching watch later:', err);
    }
  };

  // Обновление профиля
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
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

    // Загрузка на сервер
    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const response = await fetch('http://localhost:5000/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const result = await response.json();
      setUser(prev => prev ? { ...prev, avatar: result.avatar } : null);
      setAvatarPreview('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  // Форматируем дату
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
    fetchWatchLater();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Загрузка профиля...</p>
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
                  src={user.avatar === '/placeholder.jpg' ? '/placeholder.jpg' : `http://localhost:5000${user.avatar}`}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/20"
                />
                {isEditing && (
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
                )}
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

      {/* Избранное */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Избранное ({favorites.length})
          </h3>
        </div>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((favorite) => (
              <AnimeCard 
                key={favorite._id} 
                title={favorite.title} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <p className="text-gray-500 dark:text-gray-400">У вас пока нет избранного</p>
          </div>
        )}
      </motion.div>

      {/* Смотреть позже */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Смотреть позже ({watchLater.length})
          </h3>
        </div>
        
        {watchLater.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watchLater.map((item) => (
              <AnimeCard 
                key={item._id} 
                title={item.title} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <p className="text-gray-500 dark:text-gray-400">Список "Смотреть позже" пуст</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;