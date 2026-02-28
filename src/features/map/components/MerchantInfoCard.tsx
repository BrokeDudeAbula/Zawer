import { useNavigate } from 'react-router-dom'
import type { Merchant } from '@/types'
import { getZawerColor, getZawerLabel, getZawerEmoji } from '@/utils/zawer'

interface MerchantInfoCardProps {
  merchant: Merchant | null
  userPosition?: { lng: number; lat: number } | null
  onClose: () => void
}

/**
 * 计算两点间距离（简化版，单位：米）
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export default function MerchantInfoCard({
  merchant,
  userPosition,
  onClose,
}: MerchantInfoCardProps) {
  const navigate = useNavigate()

  if (!merchant) return null

  const color = getZawerColor(merchant.zawerIndex)
  const label = getZawerLabel(merchant.zawerIndex)
  const emoji = getZawerEmoji(merchant.zawerIndex)

  const distance =
    userPosition
      ? calculateDistance(
          userPosition.lat,
          userPosition.lng,
          merchant.lat,
          merchant.lng,
        )
      : null

  return (
    <div className="absolute bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom">
      <div className="rounded-xl bg-white p-4 shadow-xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex gap-3">
          {/* Zawer 指数 */}
          <div
            className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg"
            style={{ backgroundColor: color + '20' }}
          >
            <span className="text-lg">{emoji}</span>
            <span className="text-xs font-bold" style={{ color }}>
              {merchant.zawerIndex.toFixed(1)}
            </span>
          </div>

          {/* 商家信息 */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {merchant.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {label}
              </span>
              <span>{merchant.category}</span>
              {distance !== null && (
                <span>· {formatDistance(distance)}</span>
              )}
            </div>
            <p className="mt-1 truncate text-xs text-gray-400">
              {merchant.address}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => navigate(`/merchant/${merchant.id}`)}
            className="flex-1 rounded-lg bg-blue-500 py-2 text-center text-sm font-medium text-white hover:bg-blue-600"
          >
            查看详情
          </button>
          {merchant.phone && (
            <a
              href={`tel:${merchant.phone}`}
              className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              电话
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
