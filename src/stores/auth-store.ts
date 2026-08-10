import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'
import { userService } from '@/services/user'
import { getStoredAuthState, syncLegacyToken } from '@/utils/auth'

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
        syncLegacyToken(token)
        set({ user, token })
      },

      logout: () => {
        syncLegacyToken(null)
        set({ user: null, token: null })
      },

      updateProfile: async (data: Partial<User>) => {
        const updatedUser = await userService.updateProfile(data)
        set({ user: updatedUser })
      },

      refreshUser: () => {
        const storedState = getStoredAuthState()
        if (storedState?.token && storedState?.user) {
          syncLegacyToken(storedState.token)
          set({ token: storedState.token, user: storedState.user as User })
          return
        }
        syncLegacyToken(null)
        set({ token: null, user: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
