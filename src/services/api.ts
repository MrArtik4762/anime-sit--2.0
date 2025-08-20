import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.anilibria.tv';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Интерфейс для структурированной ошибки
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Создаем функцию для форматирования ошибок
const formatError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Ошибка ответа от сервера
      const status = error.response.status;
      let message = error.response.data?.message || 'Произошла ошибка при выполнении запроса';
      let code = error.response.data?.code || 'API_ERROR';
      
      // Специфические сообщения для разных кодов статуса
      if (status === 401) {
        message = 'Необходима авторизация. Пожалуйста, войдите в систему.';
        code = 'UNAUTHORIZED';
      } else if (status === 403) {
        message = 'Доступ запрещен. У вас нет прав для выполнения этой операции.';
        code = 'FORBIDDEN';
      } else if (status === 404) {
        message = 'Запрашиваемый ресурс не найден.';
        code = 'NOT_FOUND';
      } else if (status >= 500) {
        message = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';
        code = 'SERVER_ERROR';
      }
      
      return {
        message,
        code,
        status,
        details: error.response.data,
        timestamp: new Date().toISOString()
      };
    } else if (error.request) {
      // Ошибка сети (нет ответа от сервера)
      return {
        message: 'Нет соединения с сервером. Проверьте интернет-соединение.',
        code: 'NETWORK_ERROR',
        status: 0,
        timestamp: new Date().toISOString()
      };
    } else {
      // Другая ошибка
      return {
        message: error.message || 'Произошла неизвестная ошибка',
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // Не-Axios ошибка
  return {
    message: error?.message || 'Произошла неизвестная ошибка',
    code: 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  };
};

// Функция для повторной попытки запроса с экспоненциальной задержкой
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i); // Экспоненциальная задержка
        console.log(`Попытка ${i + 1} не удалась. Повтор через ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
};

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'User-Agent': 'Anime-Site-App/1.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Добавляем interceptor для автоматического добавления заголовков и логирования
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Создаем отдельный экземпляр для работы с бэкендом
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000
});

// Добавляем interceptor для автоматического добавления credentials
backendApi.defaults.withCredentials = true;

// Обработчик ошибок для бэкенда
backendApi.interceptors.response.use(
  res => res,
  err => {
    // Форматируем ошибку и возвращаем ее
    const formattedError = formatError(err);
    console.error('Backend API error:', formattedError);
    return Promise.reject(formattedError);
  }
);

// Обработчик ошибок для основного API
api.interceptors.response.use(
  res => res,
  err => {
    // Форматируем ошибку и возвращаем ее
    const formattedError = formatError(err);
    console.error('API error:', formattedError);
    return Promise.reject(formattedError);
  }
);

// Общая функция для выполнения запросов с обработкой ошибок
export const safeRequest = async <T>(
  requestFn: () => Promise<T>,
  fallbackData?: T
): Promise<{ data: T | null; error: ApiError | null }> => {
  try {
    const data = await requestFn();
    return { data, error: null };
  } catch (error) {
    const formattedError = formatError(error);
    return { data: fallbackData || null, error: formattedError };
  }
};

// Демо функции для комментариев
export const getComments = async (animeId: string, page: number = 1, limit: number = 10) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    comments: [],
    pagination: {
      current: page,
      total: 1,
      totalItems: 0
    }
  };
};

export const addComment = async (animeId: string, text: string) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `comment_${Date.now()}`,
    userId: {
      _id: '1',
      username: 'DemoUser',
      avatar: '/placeholder.jpg'
    },
    animeId,
    text,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: []
  };
};

export const updateComment = async (commentId: string, text: string) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: commentId,
    userId: {
      _id: '1',
      username: 'DemoUser',
      avatar: '/placeholder.jpg'
    },
    animeId: 'demo',
    text,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: []
  };
};

export const deleteComment = async (commentId: string) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { message: 'Comment deleted successfully' };
};

export const likeComment = async (commentId: string) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: commentId,
    userId: {
      _id: '1',
      username: 'DemoUser',
      avatar: '/placeholder.jpg'
    },
    animeId: 'demo',
    text: 'Demo comment',
    createdAt: new Date().toISOString(),
    likes: 1,
    likedBy: [{ _id: '1', username: 'DemoUser' }]
  };
};

// Функции аутентификации
export const login = async (email: string, password: string) => {
  try {
    const response = await backendApi.post('/api/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await backendApi.post('/api/auth/register', {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await backendApi.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await backendApi.get('/api/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    // Возвращаем заглушку с фейковыми данными при ошибках аутентификации
    return {
      user: {
        _id: 'demo_user_' + Date.now(),
        username: 'Demo User',
        email: 'demo@example.com',
        avatar: '/placeholder.jpg',
        theme: 'dark',
        privacy: {
          profileVisible: true,
          favoritesVisible: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      stats: {
        favoritesCount: 0,
        watchLaterCount: 0,
        commentsCount: 0
      }
    };
  }
};

export const updateProfile = async (userData: {
  username?: string;
  theme?: string;
  privacy?: {
    profileVisible?: boolean;
    favoritesVisible?: boolean;
  };
}) => {
  try {
    const response = await backendApi.put('/api/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  try {
    const response = await backendApi.post('/api/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const response = await backendApi.get('/api/profile/favorites');
    return response.data;
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  }
};

export const getWatchLater = async () => {
  try {
    const response = await backendApi.get('/api/profile/watchlater');
    return response.data;
  } catch (error) {
    console.error('Get watch later error:', error);
    throw error;
  }
};

export default api;