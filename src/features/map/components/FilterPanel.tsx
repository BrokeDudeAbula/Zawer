import React, { useState } from 'react'
import { useAppStore } from '@/stores/app-store'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

// 分类筛选由地图页的 CategoryChips 承担（分类取自实际商家），此处只做 Zawer 门槛与距离
// 阈值与 utils/zawer.ts 的分档保持一致
const ZAWER_THRESHOLDS = [
  { label: '不限', min: 0 },
  { label: '有人踩过', min: 1 },
  { label: '比较坑', min: 3 },
  { label: '极度坑', min: 10 },
]

const DISTANCE_OPTIONS = [500, 1000, 3000, 5000]

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useAppStore()
  const [localFilters, setLocalFilters] = useState(filters)

  // 当面板打开时，同步当前筛选条件
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
    }
  }, [isOpen, filters])

  const handleZawerMinChange = (min: number) => {
    setLocalFilters((prev) => ({ ...prev, zawerMin: min }))
  }

  const handleDistanceChange = (distance: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      distance: prev.distance === distance ? 3000 : distance,
    }))
  }

  const handleReset = () => {
    setLocalFilters({
      category: [],
      zawerMin: 0,
      distance: 3000,
    })
  }

  const handleConfirm = () => {
    setFilters(localFilters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />

      {/* 面板 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white shadow-gm-3 transition-transform">
        <div className="p-6">
          {/* 标题栏 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink-primary">筛选条件</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-surface-hover transition-colors"
            >
              <svg
                className="h-6 w-6 text-ink-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Zawer 门槛筛选 */}
          <div className="mb-6">
            <h3 className="mb-3 text-gm-base font-medium text-ink-primary">至少多少人说坑</h3>
            <div className="grid grid-cols-4 gap-2">
              {ZAWER_THRESHOLDS.map((tier) => (
                <button
                  key={tier.min}
                  onClick={() => handleZawerMinChange(tier.min)}
                  className={`rounded-gm px-2 py-2.5 text-gm-base font-medium transition-colors ${
                    localFilters.zawerMin === tier.min
                      ? 'bg-zawer-danger text-white'
                      : 'bg-surface-variant text-ink-primary hover:bg-outline'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* 距离筛选 */}
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">距离</h3>
            <div className="grid grid-cols-4 gap-2">
              {DISTANCE_OPTIONS.map((distance) => (
                <button
                  key={distance}
                  onClick={() => handleDistanceChange(distance)}
                  className={`rounded-gm px-3 py-2 text-sm font-medium transition-colors ${
                    localFilters.distance === distance
                      ? 'bg-gm-blue text-white'
                      : 'bg-surface-variant text-ink-primary hover:bg-outline'
                  }`}
                >
                  {distance >= 1000 ? `${distance / 1000}km` : `${distance}m`}
                </button>
              ))}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 rounded-gm border border-outline px-6 py-3 text-base font-medium text-ink-primary hover:bg-surface-hover transition-colors"
            >
              重置
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-gm bg-gm-blue px-6 py-3 text-base font-medium text-white hover:bg-gm-blue-hover transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
