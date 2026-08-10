import { useCallback } from 'react'
import type { Merchant } from '@/types'

const STORAGE_KEY = 'zawer_browse_history'
const MAX_HISTORY = 100

interface BrowseHistoryItem {
  merchantId: string
  merchantName: string
  category: string
  zawerCount: number
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
  // 历史记录只存在 localStorage 里，不依赖组件状态，因此可以返回完全稳定的引用。
  // 调用方会把 addHistory 放进 useCallback / useEffect 依赖，引用不稳定会导致无限重渲染。
  const addHistory = useCallback((merchant: Merchant) => {
    const history = getHistoryFromStorage()
    const existingIndex = history.findIndex((item) => item.merchantId === merchant.id)

    const newItem: BrowseHistoryItem = {
      merchantId: merchant.id,
      merchantName: merchant.name,
      category: merchant.category,
      zawerCount: merchant.zawerCount,
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
  }, [])

  const getHistory = useCallback((): BrowseHistoryItem[] => {
    return getHistoryFromStorage()
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    addHistory,
    getHistory,
    clearHistory,
  }
}
