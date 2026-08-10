import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { merchantService, reviewService } from '@/services'
import { Merchant, Review } from '@/types/api'
import { useFavorites, useBrowseHistory } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import LoginGuard from '@/components/LoginGuard'
import { RatingDialog } from '@/features/review/components/RatingDialog'
import ZawerScore from './components/ZawerScore'
import DimensionBar from './components/DimensionBar'
import MerchantInfo from './components/MerchantInfo'
import ReviewList from './components/ReviewList'

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { isFavorited, toggleFavorite } = useFavorites()
  const { addHistory } = useBrowseHistory()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showLoginGuard, setShowLoginGuard] = useState(false)
  const [showRatingDialog, setShowRatingDialog] = useState(false)

  const loadMerchant = useCallback(
    async (merchantId: string) => {
      try {
        setLoading(true)
        setError(null)
        const nextMerchant = await merchantService.getById(merchantId)
        setMerchant(nextMerchant)
        addHistory(nextMerchant)
      } catch (err) {
        setError('加载商家信息失败')
        console.error('Failed to load merchant:', err)
      } finally {
        setLoading(false)
      }
    },
    [addHistory],
  )

  const loadReviews = useCallback(async (merchantId: string) => {
    try {
      setReviewsLoading(true)
      const response = await reviewService.getByMerchantId(merchantId, 1, 10, 'time')
      setReviews(response.list)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setReviewsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    loadMerchant(id)
  }, [id, loadMerchant])

  useEffect(() => {
    if (!merchant) return
    loadReviews(merchant.id)
  }, [merchant, loadReviews])

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error || !merchant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="mt-2 text-gray-600">商家不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      setShowLoginGuard(true)
      return
    }
    if (merchant) {
      toggleFavorite(merchant.id)
    }
  }

  const handleOpenRating = () => {
    if (!isLoggedIn) {
      setShowLoginGuard(true)
      return
    }
    setShowRatingDialog(true)
  }

  const handleReviewSubmitted = async () => {
    if (!merchant) {
      return
    }
    await Promise.all([loadMerchant(merchant.id), loadReviews(merchant.id)])
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </button>
          {merchant && (
            <button
              onClick={handleToggleFavorite}
              className="flex-shrink-0 rounded-full p-2 hover:bg-gray-100"
            >
              <svg
                className={`h-6 w-6 ${isFavorited(merchant.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-6">
          <MerchantInfo merchant={merchant} />

          <ZawerScore zawerIndex={merchant.zawerIndex} />

          {merchant.dimensionRatings && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-semibold text-gray-900">维度评分</h3>
              <DimensionBar ratings={merchant.dimensionRatings} />
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 font-semibold text-gray-900">点评 ({merchant.reviewCount})</h3>
            <ReviewList reviews={reviews} loading={reviewsLoading} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <button
          onClick={handleOpenRating}
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          我要评分
        </button>
      </div>
      {merchant && (
        <RatingDialog
          merchantId={merchant.id}
          merchantName={merchant.name}
          isOpen={showRatingDialog}
          onClose={() => setShowRatingDialog(false)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
      <LoginGuard isOpen={showLoginGuard} onClose={() => setShowLoginGuard(false)} />
    </div>
  )
}
