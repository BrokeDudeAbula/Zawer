import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'
import { userService } from '@/services/user'

interface AuthStore {
  user: User | null
  token: string | null
  
  // 计算属性
  get isLoggedIn(): boolean
  
  // 方法
  login: (phone: string, code: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshUser: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      get isLoggedIn() {
        return !!get().token && !!get().user
      },
      
      login: async (phone: string, code: string) => {
        const { user, token } = await userService.login(phone, code)
        set({ user, token })
      },
      
      logout: () => {
        set({ user: null, token: null })
      },
      
      updateProfile: async (data: Partial<User>) => {
        const updatedUser = await userService.updateProfile(data)
        set({ user: updatedUser })
      },
      
      refreshUser: () => {
        const storedToken = localStorage.getItem('auth-storage')
        if (storedToken) {
          try {
            const parsed = JSON.parse(storedToken)
            if (parsed.state?.token && parsed.state?.user) {
              set({ token: parsed.state.token, user: parsed.state.user })
            }
          } catch (error) {
            console.error('Failed to restore auth state:', error)
            set({ token: null, user: null })
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)
