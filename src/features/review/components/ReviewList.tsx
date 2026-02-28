import React, { useState, useEffect } from 'react'
import { reviewService } from '@/services/review'
import type { Review } from '@/types'
import { ReviewItem } from './ReviewItem'

interface ReviewListProps {
  merchantId: string
}

type SortType = 'time' | 'rating'

export const ReviewList: React.FC<ReviewListProps> = ({ merchantId }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortType>('time')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const pageSize = 10

  const loadReviews = async (pageNum: number, sort: SortType, append = false) => {
    try {
      setLoading(true)
      const response = await reviewService.getByMerchantId(
        merchantId,
        pageNum,
        pageSize,
        sort,
      )
      if (append) {
        setReviews((prev) => [...prev, ...response.list])
      } else {
        setReviews(response.list)
      }
      setTotal(response.total)
      setHasMore(response.list.length === pageSize && response.total > pageNum * pageSize)
    } catch (error) {
      console.error('加载点评失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews(1, sortBy, false)
  }, [merchantId, sortBy])

  const handleSortChange = (sort: SortType) => {
    setSortBy(sort)
    setPage(1)
    loadReviews(1, sort, false)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadReviews(nextPage, sortBy, true)
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-lg font-medium">暂无点评</p>
        <p className="text-sm mt-1">快来发表第一条评价吧！</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          用户点评 ({total})
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleSortChange('time')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              sortBy === 'time'
                ? 'bg-white shadow-sm text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            最新
          </button>
          <button
            type="button"
            onClick={() => handleSortChange('rating')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              sortBy === 'rating'
                ? 'bg-white shadow-sm text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            评分最高
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  )
}
