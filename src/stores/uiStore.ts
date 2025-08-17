import { create } from 'zustand'

interface UIState {
  isLoading: boolean
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),
}))