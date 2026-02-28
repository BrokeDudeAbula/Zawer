import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { reviewService } from '@/services/review'
import { merchantService } from '@/services/merchant'
import { formatRelativeTime } from '@/utils/date'
// 使用 SVG 组件替代 heroicons
import type { Review } from '@/types'

export default function MyReviewsPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [merchantNames, setMerchantNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetchMyReviews()
  }, [isLoggedIn, user, navigate])

  const fetchMyReviews = async () => {
    if (!user) return

    setLoading(true)
    try {
      // 由于 Mock 数据，需要获取所有点评并按 userId 过滤
      const allReviewsResponse = await reviewService.getByMerchantId('', 1, 1000, 'time')
      const myReviews = allReviewsResponse.list.filter((r) => r.userId === user.id)

      setReviews(myReviews)

      // 获取商家名称
      const merchantIdSet = new Set(myReviews.map((r) => r.merchantId))
      const names: Record<string, string> = {}

      for (const merchantId of merchantIdSet) {
        const merchant = await merchantService.getById(merchantId)
        if (merchant) {
          names[merchantId] = merchant.name
        }
      }

      setMerchantNames(names)
    } catch (error) {
      console.error('获取我的点评失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="flex items-center space-x-4 border-b border-gray-200 bg-white px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        >
          <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-semibold text-gray-900">我的点评</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">暂无点评</h3>
            <p className="text-gray-500">去发表第一条评价吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    {merchantNames[review.merchantId] || '未知商家'}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                  </div>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {review.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatRelativeTime(review.createdAt)}</span>
                  <span className="flex items-center space-x-1">
                    <span>{review.likes}</span>
                    <span>赞</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}