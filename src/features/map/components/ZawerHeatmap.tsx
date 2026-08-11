import { useCallback, useEffect, useRef } from 'react'
import type { Merchant } from '@/types'

interface ZawerHeatmapProps {
  map: any
  merchants: Merchant[]
}

interface HeatMapDataSet {
  data: { lng: number; lat: number; count: number }[]
  max: number
}

interface HeatMapOptions {
  radius: number
  opacity: [number, number]
  gradient: Record<number, string>
  zooms: [number, number]
}

interface HeatMapInstance {
  setDataSet(dataSet: HeatMapDataSet): void
  setOptions(options: HeatMapOptions): void
  setMap(map: any): void
  show(): void
  hide(): void
}

// 热力图渐变：低 Zawer 偏冷色，高 Zawer 收到 Google 红
const GRADIENT = {
  0.3: 'rgba(26,115,232,0.35)',
  0.5: '#f9ab00',
  0.7: '#e8710a',
  1.0: '#d93025',
}

// 热区恒定覆盖的地理半径。高德的 radius 只接受像素，因此每次缩放都要按当前
// 比例尺换算，才能让热区在地图上始终对应同样大的实际范围。
const TARGET_METERS = 20
// 仅防止极端缩放下退化为 0 或过大，正常缩放区间不会触及
const MIN_RADIUS_PX = 1
const MAX_RADIUS_PX = 240
// Web Mercator 在赤道、zoom 0 时每像素代表的米数
const EQUATOR_METERS_PER_PIXEL = 156543.03392

function computeRadiusPx(map: any): number {
  const zoom = map.getZoom?.() ?? 14
  const lat = map.getCenter?.()?.lat ?? 30.66
  const metersPerPixel = (EQUATOR_METERS_PER_PIXEL * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom
  const radius = TARGET_METERS / metersPerPixel
  return Math.round(Math.min(MAX_RADIUS_PX, Math.max(MIN_RADIUS_PX, radius)))
}

// 每次都传完整配置，避免 setOptions 是替换语义时把渐变等设置冲掉
function buildOptions(map: any): HeatMapOptions {
  return {
    radius: computeRadiusPx(map),
    opacity: [0, 0.75],
    gradient: GRADIENT,
    zooms: [3, 20],
  }
}

export default function ZawerHeatmap({ map, merchants }: ZawerHeatmapProps) {
  const heatmapRef = useRef<HeatMapInstance | null>(null)
  const dataSetRef = useRef<HeatMapDataSet | null>(null)

  // 半径变化后需要重新灌一次数据才会重绘
  const applyRadius = useCallback(() => {
    const heatmap = heatmapRef.current
    if (!heatmap || !map) return

    heatmap.setOptions(buildOptions(map))
    if (dataSetRef.current) {
      heatmap.setDataSet(dataSetRef.current)
    }
  }, [map])

  useEffect(() => {
    if (!map) return

    const AMap = (window as any).AMap
    if (!AMap?.HeatMap) return

    // 只有被点过 Zawer 的商家才参与热力计算，0 值会让热区失真
    const data = merchants
      .filter((merchant) => merchant.zawerCount > 0)
      .map((merchant) => ({
        lng: merchant.lng,
        lat: merchant.lat,
        count: merchant.zawerCount,
      }))

    if (!heatmapRef.current) {
      try {
        heatmapRef.current = new AMap.HeatMap(map, buildOptions(map))
      } catch (err) {
        console.warn('[Heatmap] 初始化失败:', err)
        return
      }
    }

    const heatmap = heatmapRef.current
    if (!heatmap) return

    if (data.length === 0) {
      dataSetRef.current = null
      heatmap.hide()
      return
    }

    // max 取当前最大计数，保证数据量少时也有明显的强弱对比
    dataSetRef.current = { data, max: Math.max(...data.map((item) => item.count)) }
    heatmap.setOptions(buildOptions(map))
    heatmap.setDataSet(dataSetRef.current)
    heatmap.show()
  }, [map, merchants])

  // 缩放会改变比例尺，必须重算像素半径才能维持恒定的地理覆盖范围
  useEffect(() => {
    if (!map) return

    map.on('zoomend', applyRadius)
    return () => {
      map.off('zoomend', applyRadius)
    }
  }, [map, applyRadius])

  useEffect(() => {
    return () => {
      // 地图可能已被父组件 destroy，清理失败不应中断卸载流程
      try {
        heatmapRef.current?.setMap(null)
      } catch {
        // 地图已销毁，热力图图层一并失效
      }
      heatmapRef.current = null
    }
  }, [])

  return null
}
