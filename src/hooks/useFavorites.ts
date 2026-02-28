import { useState, useCallback } from 'react'
import { favoriteService } from '@/services'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => favoriteService.getList())
  const [loading, setLoading] = useState(false)

  const isFavorited = useCallback(
    (merchantId: string): boolean => {
      return favorites.includes(merchantId)
    },
    [favorites],
  )

  const toggleFavorite = useCallback(
    async (merchantId: string) => {
      setLoading(true)
      const newFavorites = isFavorited(merchantId)
        ? favorites.filter((id) => id !== merchantId)
        : [...favorites, merchantId]

      // 乐观更新
      setFavorites(newFavorites)

      try {
        if (isFavorited(merchantId)) {
          favoriteService.remove(merchantId)
        } else {
          favoriteService.add(merchantId)
        }
      } catch (err) {
        // 回滚
        setFavorites(favorites)
        console.error('Failed to toggle favorite:', err)
      } finally {
        setLoading(false)
      }
    },
    [favorites, isFavorited],
  )

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    loading,
  }
}
