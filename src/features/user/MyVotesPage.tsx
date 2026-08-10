import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { voteService } from '@/services/vote'
import { formatRelativeTime } from '@/utils/date'
import { getZawerColor } from '@/utils/zawer'
import type { MyVote } from '@/types/api'

export default function MyVotesPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [votes, setVotes] = useState<MyVote[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMyVotes = useCallback(async () => {
    setLoading(true)
    try {
      setVotes(await voteService.getMyVotes())
    } catch (error) {
      console.error('获取我点过的 Zawer 失败:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetchMyVotes()
  }, [isLoggedIn, navigate, fetchMyVotes])

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto bg-surface-hover">
      <div className="flex items-center gap-3 border-b border-outline bg-white px-2 py-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-gm-lg font-medium text-ink-primary">我点过的 Zawer</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gm-blue border-t-transparent" />
          </div>
        ) : votes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-gm-lg bg-white p-8 shadow-gm-1">
            <div className="text-4xl">🤔</div>
            <h3 className="mt-3 text-gm-lg font-medium text-ink-primary">还没点过 Zawer</h3>
            <p className="mt-1 text-gm-base text-ink-secondary">遇到坑店就来点一下</p>
          </div>
        ) : (
          <div className="space-y-3">
            {votes.map((vote) => (
              <button
                key={vote.id}
                onClick={() => navigate(`/merchant/${vote.merchantId}`)}
                className="w-full rounded-gm-lg bg-white p-4 text-left shadow-gm-1 transition-shadow hover:shadow-gm-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="min-w-0 flex-1 truncate text-gm-lg font-medium text-ink-primary">
                    {vote.merchantName || '未知商家'}
                  </h3>
                  <span
                    className="flex-shrink-0 text-gm-base font-medium"
                    style={{ color: getZawerColor(vote.zawerCount) }}
                  >
                    {vote.zawerCount} 人说坑
                  </span>
                </div>

                <p className="mt-1 text-gm-base text-ink-secondary">{vote.category}</p>

                {vote.comment && (
                  <p className="mt-2 line-clamp-2 text-gm-base text-ink-primary">
                    「{vote.comment}」
                  </p>
                )}

                <div className="mt-2 text-gm-sm text-ink-tertiary">
                  {formatRelativeTime(vote.createdAt)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
