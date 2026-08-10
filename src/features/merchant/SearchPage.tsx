import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { merchantService } from '@/services/merchant'
import { amapService } from '@/services/amap'
import { MerchantSearchResult } from '@/types/api'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import SearchResultItem from './components/SearchResultItem'

const HOT_SEARCHES = ['火锅', '串串', '酒店', '停车场', '奶茶']

export default function SearchPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<MerchantSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  const debouncedSearch = useDebounce(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      requestIdRef.current += 1
      setSearchResults([])
      setHasSearched(false)
      setSearchError(null)
      return
    }

    // 输入较快时多个请求会并发返回，只采纳最后一次请求的结果
    const requestId = (requestIdRef.current += 1)
    setIsSearching(true)
    setSearchError(null)
    try {
      // 店铺信息来自高德实时搜索，Zawer 评分来自自有数据库，用 POI ID 关联
      const pois = await amapService.searchPoi(searchKeyword)
      const scores = await merchantService.getScoresByPoiIds(pois.map((poi) => poi.poiId))
      if (requestId !== requestIdRef.current) return

      setSearchResults(pois.map((poi) => ({ ...poi, score: scores[poi.poiId] ?? null })))
      setHasSearched(true)
      addHistory(searchKeyword)
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      console.error('Search failed:', error)
      setSearchResults([])
      setHasSearched(true)
      setSearchError(error instanceof Error ? error.message : '搜索失败，请稍后重试')
    } finally {
      if (requestId === requestIdRef.current) {
        setIsSearching(false)
      }
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
    setSearchError(null)
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
    <div className="flex h-full flex-col bg-white">
      {/* 顶部搜索栏 */}
      <div className="flex-shrink-0 px-3 py-3">
        <div className="flex h-12 items-center gap-1 rounded-pill bg-white pl-1 pr-2 shadow-gm-2">
          <button
            onClick={() => navigate('/')}
            aria-label="返回地图"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <input
            type="text"
            value={keyword}
            onChange={handleInputChange}
            autoFocus
            placeholder="在这里搜索"
            className="min-w-0 flex-1 bg-transparent text-gm-lg text-ink-primary placeholder:text-ink-secondary focus:outline-none"
          />

          {keyword && (
            <button
              onClick={handleClearInput}
              aria-label="清除"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto">
        {isSearching && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gm-blue border-t-transparent" />
          </div>
        )}

        {hasSearched && !isSearching && (
          <>
            {searchError ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gm-lg text-ink-primary">{searchError}</p>
                <p className="mt-2 text-gm-base text-ink-secondary">
                  请检查高德地图 Key 与安全密钥配置
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gm-lg text-ink-primary">未找到相关商家</p>
                <p className="mt-2 text-gm-base text-ink-secondary">换个关键词试试？</p>
              </div>
            ) : (
              <div>
                {searchResults.map((result) => (
                  <SearchResultItem key={result.poiId} result={result} />
                ))}
              </div>
            )}
          </>
        )}

        {showHistoryAndHot && (
          <>
            {history.length > 0 && (
              <div className="pb-2">
                <div className="flex items-center justify-between px-4 pb-1 pt-2">
                  <h2 className="text-gm-sm font-medium uppercase tracking-wide text-ink-secondary">
                    最近搜索
                  </h2>
                  <button
                    onClick={handleClearAllHistory}
                    className="rounded-pill px-2 py-1 text-gm-base font-medium text-gm-blue transition-colors hover:bg-gm-blue-light"
                  >
                    全部清除
                  </button>
                </div>
                {history.map((historyKeyword) => (
                  <button
                    key={historyKeyword}
                    onClick={() => handleHistoryClick(historyKeyword)}
                    className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                  >
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-ink-secondary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 3a9 9 0 00-9 9H1l3.9 3.9.1.1L9 12H6a7 7 0 117 7 6.9 6.9 0 01-4.9-2l-1.4 1.4A8.9 8.9 0 0013 21a9 9 0 000-18zm-1 5v5l4.3 2.5.7-1.2-3.5-2.1V8H12z" />
                    </svg>
                    <span className="min-w-0 flex-1 truncate text-gm-lg text-ink-primary">
                      {historyKeyword}
                    </span>
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => handleHistoryRemove(e, historyKeyword)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-outline px-4 py-3">
              <h2 className="mb-3 text-gm-sm font-medium uppercase tracking-wide text-ink-secondary">
                热门搜索
              </h2>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map((hot) => (
                  <button
                    key={hot}
                    onClick={() => handleHistoryClick(hot)}
                    className="h-8 rounded-pill border border-outline px-3.5 text-gm-base font-medium text-ink-primary transition-colors hover:bg-surface-hover"
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
