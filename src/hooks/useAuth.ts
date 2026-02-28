import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, token, login, logout } = useAuthStore()

  const isLoggedIn = !!token && !!user

  const requireAuth = useCallback((callback?: () => void) => {
    if (!isLoggedIn) {
      navigate('/login')
      return false
    }
    if (callback) {
      callback()
    }
    return true
  }, [isLoggedIn, navigate])

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    requireAuth
  }
}
