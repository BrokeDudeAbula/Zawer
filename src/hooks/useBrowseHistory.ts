import type { Merchant } from '@/types'

const STORAGE_KEY = 'zawer_browse_history'
const MAX_HISTORY = 100

interface BrowseHistoryItem {
  merchantId: string
  merchantName: string
  category: string
  zawerIndex: number
  visitedAt: string
}

const getHistoryFromStorage = (): BrowseHistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveHistoryToStorage = (history: BrowseHistoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (err) {
    console.error('Failed to save browse history:', err)
  }
}

export function useBrowseHistory() {
  const addHistory = (merchant: Merchant) => {
    const history = getHistoryFromStorage()
    const existingIndex = history.findIndex((item) => item.merchantId === merchant.id)

    const newItem: BrowseHistoryItem = {
      merchantId: merchant.id,
      merchantName: merchant.name,
      category: merchant.category,
      zawerIndex: merchant.zawerIndex,
      visitedAt: new Date().toISOString(),
    }

    if (existingIndex !== -1) {
      history.splice(existingIndex, 1)
    }

    history.unshift(newItem)

    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY)
    }

    saveHistoryToStorage(history)
  }

  const getHistory = (): BrowseHistoryItem[] => {
    return getHistoryFromStorage()
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    addHistory,
    getHistory,
    clearHistory,
  }
}
