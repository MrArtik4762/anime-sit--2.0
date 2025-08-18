import axios from 'axios';

const API_BASE = import.meta.env.VITE_ANILIBRIA_BASE || 'https://anilibria.top/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

api.interceptors.response.use(
  res => res,
  err => {
    // централизованная обработка ошибок
    if (err.response) {
      console.error('API error:', err.response.status, err.response.data);
    } else {
      console.error('Network error', err.message);
    }
    return Promise.reject(err);
  }
);

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

export default api;