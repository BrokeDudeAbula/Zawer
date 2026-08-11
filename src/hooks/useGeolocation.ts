import { useState, useCallback, useEffect, useRef } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useAppStore } from '@/stores'
import type { UserLocation } from '@/stores/app-store'

interface GeolocationState {
  loading: boolean
  error: string | null
  position: UserLocation | null
  accuracy: number | null
  permissionDenied: boolean
}

interface AmapLngLat {
  lng?: number
  lat?: number
  getLng?: () => number
  getLat?: () => number
}

interface AmapGeolocationResult {
  position?: AmapLngLat
  accuracy?: number
  info?: string
  message?: string
  originMessage?: string
}

interface AmapGeolocation {
  getCurrentPosition(
    callback: (status: string, result: AmapGeolocationResult | string) => void,
  ): void
}

interface AmapNamespace {
  Geolocation: new (options: {
    enableHighAccuracy: boolean
    timeout: number
    maximumAge: number
    convert: boolean
    GeoLocationFirst: boolean
    showButton: boolean
    showMarker: boolean
    showCircle: boolean
    panToLocation: boolean
    zoomToAccuracy: boolean
  }) => AmapGeolocation
}

class GeolocationRequestError extends Error {
  constructor(
    message: string,
    readonly permissionDenied: boolean,
  ) {
    super(message)
    this.name = 'GeolocationRequestError'
  }
}

// 默认位置：成都市中心
const DEFAULT_POSITION = { lng: 104.0657, lat: 30.6595 }
let amapGeolocationPromise: Promise<AmapNamespace> | null = null

function loadAmapGeolocation(): Promise<AmapNamespace> {
  if (!amapGeolocationPromise) {
    amapGeolocationPromise = AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY || '',
      version: '2.0',
      plugins: ['AMap.Geolocation'],
    })
      .then((AMap) => AMap as AmapNamespace)
      .catch((error: unknown) => {
        // 加载失败后允许用户点击重试，而不是永久复用 rejected Promise
        amapGeolocationPromise = null
        throw error
      })
  }
  return amapGeolocationPromise
}

function getResultMessage(result: AmapGeolocationResult | string): string {
  if (typeof result === 'string') return result
  return result.originMessage || result.message || result.info || ''
}

function requestCurrentPosition(AMap: AmapNamespace): Promise<AmapGeolocationResult> {
  return new Promise((resolve, reject) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
      // 高德会把设备获取的 GPS 坐标转换为底图使用的 GCJ-02 坐标
      convert: true,
      GeoLocationFirst: true,
      showButton: false,
      showMarker: false,
      showCircle: false,
      panToLocation: false,
      zoomToAccuracy: false,
    })

    geolocation.getCurrentPosition((status, result) => {
      if (status === 'complete' && typeof result !== 'string' && result.position) {
        resolve(result)
        return
      }

      const detail = getResultMessage(result)
      const permissionDenied = /permission|denied|not allowed|拒绝|权限/i.test(detail)
      const timedOut = /timeout|time out|超时/i.test(detail)
      const message = permissionDenied
        ? '请在浏览器设置中允许访问精确位置后重试'
        : timedOut
          ? '定位超时，请确认系统定位服务与 Wi-Fi 已开启'
          : '定位失败，请检查系统和浏览器的定位设置'
      reject(new GeolocationRequestError(message, permissionDenied))
    })
  })
}

function normalizePosition(result: AmapGeolocationResult): UserLocation {
  const lng = Number(result.position?.getLng?.() ?? result.position?.lng)
  const lat = Number(result.position?.getLat?.() ?? result.position?.lat)

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new GeolocationRequestError('定位服务返回了无效坐标，请重试', false)
  }

  const rawAccuracy = Number(result.accuracy)
  return {
    lng,
    lat,
    accuracy: Number.isFinite(rawAccuracy) && rawAccuracy >= 0 ? rawAccuracy : null,
  }
}

export function useGeolocation() {
  const { userLocation, setUserLocation } = useAppStore()
  const requestIdRef = useRef(0)
  const [state, setState] = useState<GeolocationState>({
    loading: !userLocation,
    error: null,
    position: userLocation,
    accuracy: userLocation?.accuracy ?? null,
    permissionDenied: false,
  })

  const locate = useCallback(async (): Promise<UserLocation | null> => {
    const requestId = (requestIdRef.current += 1)
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const AMap = await loadAmapGeolocation()
      const result = await requestCurrentPosition(AMap)
      const position = normalizePosition(result)
      if (requestId !== requestIdRef.current) return null

      setState({
        loading: false,
        error: null,
        position,
        accuracy: position.accuracy,
        permissionDenied: false,
      })
      setUserLocation(position)
      return position
    } catch (error) {
      if (requestId !== requestIdRef.current) return null

      const permissionDenied = error instanceof GeolocationRequestError && error.permissionDenied
      const errorMessage =
        error instanceof GeolocationRequestError ? error.message : '定位服务暂时不可用，请稍后重试'

      console.warn('[Geolocation]', error)
      // 失败时保留上次有效位置；默认中心不应冒充用户当前位置
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        permissionDenied,
      }))
      return null
    }
  }, [setUserLocation])

  // 没有缓存位置时自动定位；从其它页面返回时直接复用本次会话的有效结果
  useEffect(() => {
    if (!userLocation) {
      void locate()
    }

    return () => {
      requestIdRef.current += 1
    }
  }, [locate, userLocation])

  return {
    ...state,
    locate,
    defaultPosition: DEFAULT_POSITION,
  }
}
