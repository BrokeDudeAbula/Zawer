import { useState, useEffect } from 'react'

const STORAGE_KEY = 'zawer_search_history'

const MAX_HISTORY_COUNT = 10

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse search history:', error)
      }
    }
  }, [])

  const saveHistory = (newHistory: string[]) => {
    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  }

  const addHistory = (keyword: string) => {
    if (!keyword.trim()) {
      return
    }

    const trimmedKeyword = keyword.trim()
    const newHistory = [trimmedKeyword, ...history.filter((item) => item !== trimmedKeyword)].slice(0, MAX_HISTORY_COUNT)
    saveHistory(newHistory)
  }

  const removeHistory = (keyword: string) => {
    const newHistory = history.filter((item) => item !== keyword)
    saveHistory(newHistory)
  }

  const clearHistory = () => {
    saveHistory([])
  }

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  }
}