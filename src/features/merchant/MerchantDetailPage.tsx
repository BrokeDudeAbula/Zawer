import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { merchantService, voteService } from '@/services'
import { Merchant, MerchantSearchResult, PoiScore, ZawerComment } from '@/types/api'
import { useFavorites, useBrowseHistory } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import LoginGuard from '@/components/LoginGuard'
import MerchantInfo from './components/MerchantInfo'
import ZawerCount from './components/ZawerCount'
import ZawerButton from './components/ZawerButton'
import ZawerCommentList from './components/ZawerCommentList'

interface DetailRouteState {
  poi?: MerchantSearchResult
  score?: PoiScore | null
}

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const routeState = (useLocation().state ?? {}) as DetailRouteState
  // 从搜索页跳来的未入库商家只存在于高德，本地库查不到，用路由携带的 POI 信息兜底
  const unratedPoi = routeState.poi && !routeState.score ? routeState.poi : null
  const { isLoggedIn } = useAuth()
  const { isFavorited, toggleFavorite } = useFavorites()
  const { addHistory } = useBrowseHistory()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [comments, setComments] = useState<ZawerComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [showLoginGuard, setShowLoginGuard] = useState(false)
  const [voted, setVoted] = useState(false)
  const [voting, setVoting] = useState(false)

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

  const loadComments = useCallback(async (merchantId: string) => {
    try {
      setCommentsLoading(true)
      const response = await voteService.getComments(merchantId, 1, 20)
      setComments(response.list)
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setCommentsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) return

    if (unratedPoi) {
      setMerchant({
        id: unratedPoi.poiId,
        name: unratedPoi.name,
        category: unratedPoi.category,
        address: unratedPoi.address,
        lng: unratedPoi.lng,
        lat: unratedPoi.lat,
        zawerCount: 0,
        phone: unratedPoi.phone,
      })
      setLoading(false)
      return
    }

    loadMerchant(id)
  }, [id, unratedPoi, loadMerchant])

  useEffect(() => {
    if (!merchant || unratedPoi) return
    loadComments(merchant.id)
  }, [merchant, unratedPoi, loadComments])

  // 登录状态下需要知道自己是否已投过票，按钮才能显示成「取消」
  useEffect(() => {
    if (!merchant || unratedPoi || !isLoggedIn) {
      setVoted(false)
      return
    }
    voteService
      .hasVoted(merchant.id)
      .then((res) => setVoted(res.voted))
      .catch(() => setVoted(false))
  }, [merchant, unratedPoi, isLoggedIn])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gm-blue border-t-transparent" />
      </div>
    )
  }

  if (error || !merchant) {
    return (
      <div className="flex h-full items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-gm-xl font-medium text-ink-primary">商家不存在</h1>
          <p className="mt-2 text-gm-base text-ink-secondary">这个地点可能已经下线</p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 rounded-pill bg-gm-blue px-5 py-2.5 text-gm-base font-medium text-white transition-colors hover:bg-gm-blue-hover"
          >
            返回地图
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

  const handleZawer = async (comment?: string) => {
    if (!isLoggedIn) {
      setShowLoginGuard(true)
      return
    }
    if (!merchant) return

    try {
      setVoting(true)
      const result = await voteService.toggle({
        merchantId: merchant.id,
        poi: unratedPoi ?? undefined,
        comment,
      })

      // 首次投票会让商家真正入库，此后需改用后端返回的商家 ID，不能再依赖 POI ID
      if (unratedPoi) {
        navigate(`/merchant/${result.merchantId}`, { replace: true })
        return
      }

      setVoted(result.voted)
      setMerchant({ ...merchant, zawerCount: result.zawerCount })
      await loadComments(merchant.id)
    } catch (err) {
      console.error('Zawer 操作失败:', err)
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 顶部操作条 */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-outline px-2 py-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
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
        {merchant && !unratedPoi && (
          <button
            onClick={handleToggleFavorite}
            aria-label="收藏"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
          >
            <svg
              className={`h-5 w-5 ${
                isFavorited(merchant.id) ? 'fill-gm-blue text-gm-blue' : 'text-ink-secondary'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="px-4 py-4">
            <MerchantInfo merchant={merchant} />
          </div>

          <div className="border-t border-outline px-4 py-4">
            {unratedPoi ? (
              <div className="text-center">
                <div className="text-3xl">🤔</div>
                <div className="mt-2 text-gm-lg font-medium text-ink-primary">还没人说这家坑</div>
                <p className="mt-1 text-gm-base text-ink-secondary">
                  你可以成为第一个点 Zawer 的人
                </p>
              </div>
            ) : (
              <ZawerCount zawerCount={merchant.zawerCount} />
            )}
          </div>

          {!unratedPoi && (
            <div className="border-t border-outline px-4 py-4">
              <h3 className="mb-3 text-gm-sm font-medium uppercase tracking-wide text-ink-secondary">
                吐槽 ({comments.length})
              </h3>
              <ZawerCommentList comments={comments} loading={commentsLoading} />
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-outline bg-white px-4 py-3">
        <ZawerButton voted={voted} submitting={voting} onSubmit={handleZawer} />
      </div>
      <LoginGuard isOpen={showLoginGuard} onClose={() => setShowLoginGuard(false)} />
    </div>
  )
}
