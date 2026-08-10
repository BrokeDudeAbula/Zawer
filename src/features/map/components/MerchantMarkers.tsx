import { useEffect, useRef } from 'react'
import type { Merchant } from '@/types'
import { getZawerColor } from '@/utils/zawer'

interface MerchantMarkersProps {
  map: any
  merchants: Merchant[]
  onMarkerClick?: (merchant: Merchant) => void
}

const GM_SHADOW = '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)'

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 仿 Google Maps 的地点标签：白底深色字，用左侧圆点表达 Zawer 等级
function createMarkerContent(merchant: Merchant): HTMLElement {
  const color = getZawerColor(merchant.zawerCount)
  const name = merchant.name.length > 8 ? `${merchant.name.slice(0, 8)}…` : merchant.name
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
        background: #ffffff;
        color: #202124;
        padding: 5px 10px 5px 8px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        box-shadow: ${GM_SHADOW};
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <span style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${color};
          flex-shrink: 0;
        "></span>
        <span>${escapeHtml(name)}</span>
        <span style="color: ${color}; font-weight: 600;">${merchant.zawerCount}</span>
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #ffffff;
        filter: drop-shadow(0 1px 1px rgba(60,64,67,.25));
      "></div>
    </div>
  `
  return el
}

export default function MerchantMarkers({ map, merchants, onMarkerClick }: MerchantMarkersProps) {
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
              background: #1a73e8;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: 500;
              box-shadow: ${GM_SHADOW};
              border: 2px solid #ffffff;
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
