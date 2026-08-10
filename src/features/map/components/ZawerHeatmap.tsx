import { useEffect, useRef } from 'react'
import type { Merchant } from '@/types'

interface ZawerHeatmapProps {
  map: any
  merchants: Merchant[]
}

interface HeatMapInstance {
  setDataSet(dataSet: { data: { lng: number; lat: number; count: number }[]; max: number }): void
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

export default function ZawerHeatmap({ map, merchants }: ZawerHeatmapProps) {
  const heatmapRef = useRef<HeatMapInstance | null>(null)

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
        heatmapRef.current = new AMap.HeatMap(map, {
          radius: 40,
          opacity: [0, 0.75],
          gradient: GRADIENT,
          zooms: [3, 20],
        })
      } catch (err) {
        console.warn('[Heatmap] 初始化失败:', err)
        return
      }
    }

    const heatmap = heatmapRef.current
    if (!heatmap) return

    if (data.length === 0) {
      heatmap.hide()
      return
    }

    // max 取当前最大计数，保证数据量少时也有明显的强弱对比
    const max = Math.max(...data.map((item) => item.count))
    heatmap.setDataSet({ data, max })
    heatmap.show()
  }, [map, merchants])

  useEffect(() => {
    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null)
        heatmapRef.current = null
      }
    }
  }, [])

  return null
}
