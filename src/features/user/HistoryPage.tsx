import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrowseHistory } from '@/hooks'

interface BrowseHistoryItem {
  merchantId: string
  merchantName: string
  category: string
  zawerIndex: number
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

  const getZawerIndexColor = (index: number) => {
    if (index >= 4) return 'text-green-600'
    if (index >= 3) return 'text-yellow-600'
    return 'text-red-600'
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
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300"
      onClick={() => navigate(`/merchants/${item.merchantId}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{item.merchantName}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className={`font-semibold ${getZawerIndexColor(item.zawerIndex)}`}>
              Zawer 指数 {item.zawerIndex.toFixed(1)}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">{item.category}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">浏览于 {formatTime(item.visitedAt)}</p>
        </div>
      </div>
    </div>
  )

  const renderGroup = (title: string, items: BrowseHistoryItem[]) => {
    if (items.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-500">{title}</h3>
        <div className="space-y-3">{items.map(renderHistoryItem)}</div>
      </div>
    )
  }

  const hasHistory =
    groupedHistory.today.length > 0 ||
    groupedHistory.yesterday.length > 0 ||
    groupedHistory.earlier.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h1 className="text-xl font-bold text-gray-900">浏览历史</h1>
          {hasHistory && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              清空
            </button>
          )}
        </div>

        {!hasHistory ? (
          <div className="flex h-[60vh] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
            <svg className="mb-4 h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-600">暂无浏览记录</p>
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
          <div className="w-80 rounded-lg bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">确认清空</h3>
            <p className="mb-4 text-gray-600">确定要清空所有浏览记录吗？</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleClearHistory}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
