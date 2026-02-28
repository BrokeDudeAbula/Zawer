const STORAGE_KEY = 'zawer_favorites'

const getFavoritesFromStorage = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveFavoritesToStorage = (favorites: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (err) {
    console.error('Failed to save favorites:', err)
  }
}

export const favoriteService = {
  getList(): string[] {
    return getFavoritesFromStorage()
  },

  add(merchantId: string): void {
    const favorites = getFavoritesFromStorage()
    if (!favorites.includes(merchantId)) {
      favorites.push(merchantId)
      saveFavoritesToStorage(favorites)
    }
  },

  remove(merchantId: string): void {
    const favorites = getFavoritesFromStorage()
    const filtered = favorites.filter((id) => id !== merchantId)
    saveFavoritesToStorage(filtered)
  },

  isFavorited(merchantId: string): boolean {
    return getFavoritesFromStorage().includes(merchantId)
  },
}
