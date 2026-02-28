import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '@/stores'

interface GeolocationState {
  loading: boolean
  error: string | null
  position: { lng: number; lat: number } | null
  permissionDenied: boolean
}

// 默认位置：成都市中心
const DEFAULT_POSITION = { lng: 104.0657, lat: 30.6595 }

export function useGeolocation() {
  const { setUserLocation } = useAppStore()
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
    permissionDenied: false,
  })

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: '您的浏览器不支持定位功能',
        position: DEFAULT_POSITION,
        permissionDenied: false,
      })
      setUserLocation(DEFAULT_POSITION)
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = {
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
        }
        setState({
          loading: false,
          error: null,
          position,
          permissionDenied: false,
        })
        setUserLocation(position)
      },
      (err) => {
        const permissionDenied = err.code === err.PERMISSION_DENIED
        const errorMsg = permissionDenied
          ? '定位权限被拒绝，已使用默认位置'
          : '定位失败，已使用默认位置'

        console.warn('[Geolocation]', err.message)

        setState({
          loading: false,
          error: errorMsg,
          position: DEFAULT_POSITION,
          permissionDenied,
        })
        setUserLocation(DEFAULT_POSITION)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 分钟缓存
      },
    )
  }, [setUserLocation])

  // 组件挂载时自动定位
  useEffect(() => {
    locate()
  }, [locate])

  return {
    ...state,
    locate, // 暴露手动重新定位方法
    defaultPosition: DEFAULT_POSITION,
  }
}
