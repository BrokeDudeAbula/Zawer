import { useEffect, useState } from 'react'
import { getZawerColor } from '@/utils/zawer'
import { useNavigate } from 'react-router-dom'
import { useBrowseHistory } from '@/hooks'

interface BrowseHistoryItem {
  merchantId: string
  merchantName: string
  category: string
  zawerCount: number
  visitedAt: string
}

interface GroupedHistory {
  today: BrowseHistoryItem[]
  yesterday: BrowseHistoryItem[]
  earlier: BrowseHistoryItem[]
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const { getHistory, clearHistory } = useBrowseHistory()
  const [groupedHistory, setGroupedHistory] = useState<GroupedHistory>({
    today: [],
    yesterday: [],
    earlier: [],
  })
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    const history = getHistory()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const grouped: GroupedHistory = {
      today: [],
      yesterday: [],
      earlier: [],
    }

    history.forEach((item) => {
      const itemDate = new Date(item.visitedAt)
      if (itemDate >= today) {
        grouped.today.push(item)
      } else if (itemDate >= yesterday) {
        grouped.yesterday.push(item)
      } else {
        grouped.earlier.push(item)
      }
    })

    setGroupedHistory(grouped)
  }, [getHistory])

  const handleClearHistory = () => {
    clearHistory()
    setGroupedHistory({ today: [], yesterday: [], earlier: [] })
    setShowClearConfirm(false)
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const renderHistoryItem = (item: BrowseHistoryItem) => (
    <div
      key={item.merchantId}
      className="cursor-pointer rounded-gm border border-outline bg-white p-4 hover:border-outline"
      onClick={() => navigate(`/merchant/${item.merchantId}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink-primary">{item.merchantName}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-medium" style={{ color: getZawerColor(item.zawerCount) }}>
              {item.zawerCount} 人说坑
            </span>
            <span className="text-ink-tertiary">|</span>
            <span className="text-sm text-ink-secondary">{item.category}</span>
          </div>
          <p className="mt-1 text-sm text-ink-secondary">浏览于 {formatTime(item.visitedAt)}</p>
        </div>
      </div>
    </div>
  )

  const renderGroup = (title: string, items: BrowseHistoryItem[]) => {
    if (items.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-ink-secondary">{title}</h3>
        <div className="space-y-3">{items.map(renderHistoryItem)}</div>
      </div>
    )
  }

  const hasHistory =
    groupedHistory.today.length > 0 ||
    groupedHistory.yesterday.length > 0 ||
    groupedHistory.earlier.length > 0

  return (
    <div className="h-full overflow-y-auto bg-surface-hover">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ink-secondary hover:text-ink-primary"
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
          <h1 className="text-xl font-bold text-ink-primary">浏览历史</h1>
          {hasHistory && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-gm-red hover:text-red-700"
            >
              清空
            </button>
          )}
        </div>

        {!hasHistory ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg text-ink-secondary">暂无浏览记录</p>
          </div>
        ) : (
          <div>
            {renderGroup('今天', groupedHistory.today)}
            {renderGroup('昨天', groupedHistory.yesterday)}
            {renderGroup('更早', groupedHistory.earlier)}
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-gm bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-ink-primary">确认清空</h3>
            <p className="mb-4 text-ink-secondary">确定要清空所有浏览记录吗？</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-gm border border-outline px-4 py-2 text-ink-primary hover:bg-surface-hover"
              >
                取消
              </button>
              <button
                onClick={handleClearHistory}
                className="rounded-gm bg-gm-red px-4 py-2 text-white hover:bg-red-700"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
