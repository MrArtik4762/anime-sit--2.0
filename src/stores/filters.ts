import create from 'zustand';

type FiltersState = {
  genres: string[];
  years: number[];
  status: string[];
  toggleGenre: (g: string) => void;
  setYears: (years: number[]) => void;
  reset: () => void;
};

export const useFiltersStore = create<FiltersState>(set => ({
  genres: [],
  years: [],
  status: [],
  toggleGenre: (g: string) =>
    set(state => ({ genres: state.genres.includes(g) ? state.genres.filter(x => x !== g) : [...state.genres, g] })),
  setYears: (years: number[]) => set({ years }),
  reset: () => set({ genres: [], years: [], status: [] })
}));