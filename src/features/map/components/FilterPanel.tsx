import React, { useState } from 'react'
import { useAppStore } from '@/stores/app-store'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = ['餐饮', '住宿', '出行', '购物', '娱乐']

const ZAWER_LEVELS = [
  { label: '极度Zawer', range: [4, 5] as [number, number], color: 'red' },
  { label: '一般', range: [2.5, 4] as [number, number], color: 'yellow' },
  { label: '不Zawer', range: [1, 2.5] as [number, number], color: 'green' },
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

  const handleCategoryToggle = (category: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }))
  }

  const handleZawerLevelChange = (range: [number, number]) => {
    setLocalFilters((prev) => ({
      ...prev,
      zawerLevel: prev.zawerLevel[0] === range[0] && prev.zawerLevel[1] === range[1]
        ? [1, 5] as [number, number]
        : range,
    }))
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
      zawerLevel: [1, 5],
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
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* 面板 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white shadow-xl transition-transform">
        <div className="p-6">
          {/* 标题栏 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">筛选条件</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="h-6 w-6 text-gray-500"
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

          {/* 品类筛选 */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">品类</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    localFilters.category.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Zawer 等级筛选 */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Zawer 等级</h3>
            <div className="flex gap-2">
              {ZAWER_LEVELS.map((level) => {
                const isActive =
                  localFilters.zawerLevel[0] === level.range[0] &&
                  localFilters.zawerLevel[1] === level.range[1]
                const colorClass = {
                  red: isActive ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100',
                  yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
                  green: isActive ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100',
                }[level.color]

                return (
                  <button
                    key={level.label}
                    onClick={() => handleZawerLevelChange(level.range)}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${colorClass}`}
                  >
                    {level.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 距离筛选 */}
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">距离</h3>
            <div className="grid grid-cols-4 gap-2">
              {DISTANCE_OPTIONS.map((distance) => (
                <button
                  key={distance}
                  onClick={() => handleDistanceChange(distance)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    localFilters.distance === distance
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-lg bg-blue-500 px-6 py-3 text-base font-medium text-white hover:bg-blue-600 transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
