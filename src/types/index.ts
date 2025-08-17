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