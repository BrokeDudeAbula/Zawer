import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Merchant } from '@/types'
import { calculateDistance } from '@/utils/geo'
import { getZawerColor, getZawerLabel } from '@/utils/zawer'

interface MerchantInfoCardProps {
  merchant: Merchant | null
  userPosition?: { lng: number; lat: number } | null
  onClose: () => void
}

// 拖拽超过该距离才触发展开/收起，避免误触
const DRAG_THRESHOLD = 48

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export default function MerchantInfoCard({
  merchant,
  userPosition,
  onClose,
}: MerchantInfoCardProps) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartRef = useRef<number | null>(null)

  // 切换商家时回到收起状态
  useEffect(() => {
    setExpanded(false)
    setDragOffset(0)
  }, [merchant?.id])

  if (!merchant) return null

  const color = getZawerColor(merchant.zawerCount)
  const label = getZawerLabel(merchant.zawerCount)
  const distance = userPosition
    ? calculateDistance(userPosition.lat, userPosition.lng, merchant.lat, merchant.lng)
    : null

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = e.clientY
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartRef.current === null) return
    // 只对向下拖动做实时位移反馈，向上拖动仅在松手时展开
    setDragOffset(Math.max(0, e.clientY - dragStartRef.current))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartRef.current === null) return
    const delta = e.clientY - dragStartRef.current

    if (delta < -DRAG_THRESHOLD) {
      setExpanded(true)
    } else if (delta > DRAG_THRESHOLD) {
      if (expanded) {
        setExpanded(false)
      } else {
        onClose()
      }
    }

    dragStartRef.current = null
    setDragOffset(0)
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl bg-white shadow-gm-4"
      style={{
        transform: `translateY(${dragOffset}px)`,
        transition: dragStartRef.current === null ? 'transform 200ms ease-out' : 'none',
      }}
    >
      {/* 拖拽区域 */}
      <div
        className="flex cursor-grab touch-none justify-center pb-1 pt-2.5 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="h-1 w-8 rounded-pill bg-outline" />
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-gm-lg font-medium text-ink-primary">{merchant.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-gm-base text-ink-secondary">
              <span className="font-medium" style={{ color }}>
                {merchant.zawerCount}
              </span>
              <span
                className="rounded-pill px-1.5 py-0.5 text-gm-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {label}
              </span>
              <span className="truncate">
                · {merchant.category}
                {distance !== null && ` · ${formatDistance(distance)}`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="关闭"
            className="-mr-1 -mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-variant"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 展开区：地址等次要信息 */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            expanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-3 flex items-start gap-2 text-gm-base text-ink-secondary">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
            </svg>
            <span>{merchant.address}</span>
          </div>
          {merchant.phone && (
            <div className="mt-2 flex items-center gap-2 text-gm-base text-ink-secondary">
              <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.02l-2.2 2.21z" />
              </svg>
              <span>{merchant.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => navigate(`/merchant/${merchant.id}`)}
            className="flex-1 rounded-pill bg-gm-blue py-2.5 text-gm-base font-medium text-white transition-colors hover:bg-gm-blue-hover"
          >
            查看详情
          </button>
          {merchant.phone && (
            <a
              href={`tel:${merchant.phone}`}
              className="flex items-center justify-center gap-1.5 rounded-pill border border-outline px-4 py-2.5 text-gm-base font-medium text-gm-blue transition-colors hover:bg-gm-blue-light"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.02l-2.2 2.21z" />
              </svg>
              电话
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
