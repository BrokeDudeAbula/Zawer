import { useEffect, useRef } from 'react'
import type { Merchant } from '@/types'
import { getZawerColor } from '@/utils/zawer'

interface MerchantMarkersProps {
  map: any
  merchants: Merchant[]
  onMarkerClick?: (merchant: Merchant) => void
}

/**
 * 创建自定义 Marker 内容
 */
function createMarkerContent(merchant: Merchant): HTMLElement {
  const color = getZawerColor(merchant.zawerIndex)
  const el = document.createElement('div')
  el.style.cssText = 'cursor: pointer; user-select: none;'
  el.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
    ">
      <div style="
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>${merchant.name.length > 4 ? merchant.name.slice(0, 4) + '...' : merchant.name}</span>
        <span style="
          background: rgba(255,255,255,0.3);
          padding: 1px 4px;
          border-radius: 6px;
          font-size: 11px;
        ">${merchant.zawerIndex.toFixed(1)}</span>
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${color};
        margin-top: -1px;
      "></div>
    </div>
  `
  return el
}

export default function MerchantMarkers({
  map,
  merchants,
  onMarkerClick,
}: MerchantMarkersProps) {
  const markersRef = useRef<any[]>([])
  const clusterRef = useRef<any>(null)

  useEffect(() => {
    if (!map || merchants.length === 0) return

    const AMap = (window as any).AMap
    if (!AMap) return

    // 清除旧标注
    if (clusterRef.current) {
      clusterRef.current.setMap(null)
      clusterRef.current = null
    }
    markersRef.current.forEach((m) => map.remove(m))
    markersRef.current = []

    // 创建标注
    const markers = merchants.map((merchant) => {
      const marker = new AMap.Marker({
        position: new AMap.LngLat(merchant.lng, merchant.lat),
        content: createMarkerContent(merchant),
        offset: new AMap.Pixel(0, 0),
        zIndex: 100,
        extData: merchant,
      })

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(merchant))
      }

      return marker
    })

    // 使用 MarkerCluster 聚合
    try {
      clusterRef.current = new AMap.MarkerCluster(map, markers, {
        gridSize: 60,
        maxZoom: 18,
        renderMarker: (ctx: any) => {
          // 单个标注时使用自定义内容
          const merchant = ctx.marker?.getExtData?.()
          if (merchant) {
            ctx.marker.setContent(createMarkerContent(merchant))
            ctx.marker.setOffset(new AMap.Pixel(0, 0))
          }
        },
        renderClusterMarker: (ctx: any) => {
          // 聚合标注样式
          const count = ctx.count
          const el = document.createElement('div')
          el.innerHTML = `
            <div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: 700;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
              border: 2px solid white;
            ">${count}</div>
          `
          ctx.marker.setContent(el)
          ctx.marker.setOffset(new AMap.Pixel(-20, -20))
        },
      })
    } catch {
      // MarkerCluster 不可用时直接添加标注
      markers.forEach((m) => map.add(m))
      markersRef.current = markers
    }

    return () => {
      if (clusterRef.current) {
        clusterRef.current.setMap(null)
        clusterRef.current = null
      }
      markersRef.current.forEach((m) => map.remove(m))
      markersRef.current = []
    }
  }, [map, merchants, onMarkerClick])

  return null
}
