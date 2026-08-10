import { create } from 'zustand'

interface AppState {
  // 用户位置
  userLocation: { lng: number; lat: number } | null
  setUserLocation: (location: { lng: number; lat: number } | null) => void
  // 筛选条件
  filters: {
    category: string[]
    // 至少被多少人点过 Zawer，0 表示不限
    zawerMin: number
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
    zawerMin: 0,
    distance: 3000,
  },
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}))
