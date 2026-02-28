import { useRef } from 'react'
import { useAMap } from '@/hooks/useAMap'

interface MapContainerProps {
  center?: [number, number]
  zoom?: number
  onMapReady?: (map: any) => void
  children?: React.ReactNode
}

export default function MapContainer({
  center,
  zoom = 14,
  onMapReady,
  children,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { map, loading, error } = useAMap({
    container: containerRef,
    center,
    zoom,
  })

  // 地图就绪回调
  if (!loading && !error && map.current && onMapReady) {
    onMapReady(map.current)
  }

  return (
    <div className="relative h-full w-full">
      {/* 地图容器 */}
      <div ref={containerRef} className="h-full w-full" />

      {/* 加载状态 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-500">地图加载中...</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mb-3 text-4xl">🗺️</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">地图加载失败</h3>
            <p className="mb-4 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              重新加载
            </button>
          </div>
        </div>
      )}

      {/* 子组件（覆盖层） */}
      {!loading && !error && children}
    </div>
  )
}
