import { useState, useEffect } from 'react'
import { merchantService } from '@/services/merchant'
import { Merchant } from '@/types/api'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import SearchResultItem from './components/SearchResultItem'

const HOT_SEARCHES = ['火锅', '串串', '酒店', '停车场', '奶茶']

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<Merchant[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  const debouncedSearch = useDebounce(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await merchantService.search(searchKeyword)
      setSearchResults(results)
      setHasSearched(true)
      addHistory(searchKeyword)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(keyword)
  }, [keyword, debouncedSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const handleClearInput = () => {
    setKeyword('')
    setSearchResults([])
    setHasSearched(false)
  }

  const handleHistoryClick = (historyKeyword: string) => {
    setKeyword(historyKeyword)
  }

  const handleHistoryRemove = (e: React.MouseEvent, historyKeyword: string) => {
    e.stopPropagation()
    removeHistory(historyKeyword)
  }

  const handleClearAllHistory = () => {
    clearHistory()
  }

  const showHistoryAndHot = !hasSearched && !isSearching

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          <input
            type="text"
            value={keyword}
            onChange={handleInputChange}
            placeholder="搜索商家..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {keyword && (
            <button
              onClick={handleClearInput}
              className="ml-2 px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              清除
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        {isSearching && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">搜索中...</div>
          </div>
        )}

        {hasSearched && !isSearching && (
          <>
            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <p className="text-gray-500">未找到相关商家，换个关键词试试？</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((merchant) => (
                  <SearchResultItem key={merchant.id} merchant={merchant} />
                ))}
              </div>
            )}
          </>
        )}

        {showHistoryAndHot && (
          <>
            {history.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">搜索历史</h2>
                  <button
                    onClick={handleClearAllHistory}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    全部清除
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((historyKeyword) => (
                    <button
                      key={historyKeyword}
                      onClick={() => handleHistoryClick(historyKeyword)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span>{historyKeyword}</span>
                      <span
                        onClick={(e) => handleHistoryRemove(e, historyKeyword)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">热门搜索</h2>
              <div className="grid grid-cols-2 gap-2">
                {HOT_SEARCHES.map((hot) => (
                  <button
                    key={hot}
                    onClick={() => handleHistoryClick(hot)}
                    className="px-4 py-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
                  >
                    {hot}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
