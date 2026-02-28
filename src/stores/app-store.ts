import { create } from 'zustand'

interface AppState {
  // 用户位置
  userLocation: { lng: number; lat: number } | null
  setUserLocation: (location: { lng: number; lat: number } | null) => void
  // 筛选条件
  filters: {
    category: string[]
    zawerLevel: [number, number]
    distance: number
  }
  setFilters: (filters: Partial<AppState['filters']>) => void
  // 搜索关键词
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  filters: {
    category: [],
    zawerLevel: [1, 5],
    distance: 3000,
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}))
