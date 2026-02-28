import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'

interface UseAMapOptions {
  container: React.RefObject<HTMLDivElement | null>
  center?: [number, number]
  zoom?: number
}

export function useAMap({ container, center, zoom = 14 }: UseAMapOptions) {
  const mapRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!container.current) return

    let map: any = null

    const initMap = async () => {
      try {
        setLoading(true)
        setError(null)

        const AMap = await AMapLoader.load({
          key: import.meta.env.VITE_AMAP_KEY || '',
          version: '2.0',
          plugins: ['AMap.Geolocation', 'AMap.MarkerCluster', 'AMap.InfoWindow'],
        })

        map = new AMap.Map(container.current, {
          zoom,
          center: center || [104.0657, 30.6595],
          viewMode: '2D',
          resizeEnable: true,
        })

        mapRef.current = map
        setLoading(false)
      } catch (err) {
        console.error('[AMap] 地图加载失败:', err)
        setError('地图加载失败，请检查网络连接或 API Key 配置')
        setLoading(false)
      }
    }

    initMap()

    return () => {
      if (map) {
        map.destroy()
        mapRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { map: mapRef, loading, error }
}
