export interface TitleNames {
  ru?: string | null;
  en?: string | null;
  jp?: string | null;
}

export interface Poster {
  url: string;
  width?: number;
  height?: number;
}

export interface Title {
  id: number;
  names: TitleNames;
  posters: {
    medium: Poster;
    original?: Poster;
    small?: Poster;
  };
  player?: {
    episodes: {
      last: number;
    };
  };
  description?: string;
  genres?: string[];
  year?: number;
  status?: string;
  [key: string]: unknown;
}

export interface User {
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
  // Социальные фичи
  friends?: string[];
  friendRequests?: {
    incoming: string[];
    outgoing: string[];
  };
  following?: string[];
  followers?: string[];
  // Геймификация
  level?: number;
  experience?: number;
  achievements?: string[];
  stats?: {
    commentsCount: number;
    favoritesCount: number;
    likesReceived: number;
    animeWatched: number;
  };
}

export interface Comment {
  id: string;
  userId: {
    _id: string;
    username: string;
    avatar: string;
  };
  animeId: string;
  text: string;
  createdAt: string;
  likes: number;
  likedBy: Array<{
    _id: string;
    username: string;
  }>;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    current: number;
    total: number;
    totalItems: number;
  };
}