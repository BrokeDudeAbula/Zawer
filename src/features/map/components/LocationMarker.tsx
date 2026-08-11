import { useEffect, useRef } from 'react'

interface LocationMarkerProps {
  map: any
  position: { lng: number; lat: number }
}

export default function LocationMarker({ map, position }: LocationMarkerProps) {
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!map || !position) return

    // 如果已有标记，先移除
    if (markerRef.current) {
      map.remove(markerRef.current)
    }

    // 创建自定义用户位置标记（蓝色脉冲点）
    const AMap = (window as any).AMap
    if (!AMap) return

    const markerContent = document.createElement('div')
    markerContent.innerHTML = `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #1a73e8;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(26,115,232,.45);
          z-index: 2;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: rgba(26, 115, 232, 0.2);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          z-index: 1;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      </style>
    `

    const marker = new AMap.Marker({
      position: new AMap.LngLat(position.lng, position.lat),
      content: markerContent,
      offset: new AMap.Pixel(-12, -12),
      zIndex: 200,
    })

    map.add(marker)
    markerRef.current = marker

    return () => {
      // 地图可能已被父组件 destroy，清理失败不应中断卸载流程
      try {
        if (markerRef.current) {
          map.remove(markerRef.current)
        }
      } catch {
        // 地图已销毁，标记一并失效
      }
      markerRef.current = null
    }
  }, [map, position])

  return null
}
