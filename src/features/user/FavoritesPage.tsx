import { useEffect, useState } from 'react'
import { getZawerColor } from '@/utils/zawer'
import { useNavigate } from 'react-router-dom'
import { merchantService } from '@/services'
import { useFavorites } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import LoginGuard from '@/components/LoginGuard'
import type { Merchant } from '@/types'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { favorites, isFavorited, toggleFavorite } = useFavorites()
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginGuard, setShowLoginGuard] = useState(false)

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true)
        if (favorites.length === 0) {
          setMerchants([])
          return
        }

        const merchantDetails = await Promise.all(
          favorites.map((id) => merchantService.getById(id)),
        )
        setMerchants(merchantDetails)
      } catch (err) {
        console.error('Failed to load favorites:', err)
        setMerchants([])
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) {
      loadFavorites()
    }
  }, [isLoggedIn, favorites])

  const handleToggleFavorite = (merchantId: string) => {
    if (!isLoggedIn) {
      setShowLoginGuard(true)
      return
    }
    toggleFavorite(merchantId)
  }

  if (!isLoggedIn) {
    return (
      <div className="h-full overflow-y-auto bg-surface-hover">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-ink-secondary hover:text-ink-primary"
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
          <div className="flex h-[60vh] flex-col items-center justify-center rounded-gm border border-outline bg-white p-8">
            <svg
              className="mb-4 h-16 w-16 text-ink-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-lg text-ink-secondary">请先登录查看收藏</p>
            <button
              onClick={() => setShowLoginGuard(true)}
              className="mt-4 rounded-gm bg-gm-blue px-6 py-2 text-white hover:bg-gm-blue-hover"
            >
              去登录
            </button>
          </div>
        </div>
        <LoginGuard isOpen={showLoginGuard} onClose={() => setShowLoginGuard(false)} />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-surface-hover">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-ink-secondary hover:text-ink-primary"
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

        <h1 className="mb-6 text-2xl font-bold text-ink-primary">我的收藏</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-ink-secondary">加载中...</div>
          </div>
        ) : merchants.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center rounded-gm border border-outline bg-white p-8">
            <svg
              className="mb-4 h-16 w-16 text-ink-tertiary"
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
            <p className="text-lg text-ink-secondary">暂无收藏，去发现好商家吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="cursor-pointer rounded-gm border border-outline bg-white p-4 hover:border-outline"
                onClick={() => navigate(`/merchant/${merchant.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-primary">{merchant.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: getZawerColor(merchant.zawerCount) }}
                      >
                        {merchant.zawerCount} 人说坑
                      </span>
                      <span className="text-ink-tertiary">|</span>
                      <span className="text-sm text-ink-secondary">{merchant.category}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-secondary">{merchant.address}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFavorite(merchant.id)
                    }}
                    className="ml-4 flex-shrink-0 rounded-full p-2 hover:bg-surface-hover"
                  >
                    <svg
                      className={`h-6 w-6 ${isFavorited(merchant.id) ? 'fill-red-500 text-gm-red' : 'text-ink-tertiary'}`}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <LoginGuard isOpen={showLoginGuard} onClose={() => setShowLoginGuard(false)} />
    </div>
  )
}
