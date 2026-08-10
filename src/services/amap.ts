import AMapLoader from '@amap/amap-jsapi-loader'
import type { AmapPoi } from '@/types/api'

// 高德搜索默认限定城市，避免同名店铺在全国范围内命中
const DEFAULT_CITY = '成都'
const PAGE_SIZE = 20

interface AmapRawPoi {
  id: string
  name: string
  address?: string | string[]
  type?: string
  tel?: string
  location?: { lng: number; lat: number }
}

interface AmapSearchResult {
  poiList?: { pois?: AmapRawPoi[] }
}

interface AmapPlaceSearch {
  search(
    keyword: string,
    callback: (status: string, result: AmapSearchResult | string) => void,
  ): void
}

interface AmapNamespace {
  PlaceSearch: new (options: {
    city: string
    citylimit: boolean
    pageSize: number
  }) => AmapPlaceSearch
}

let placeSearchPromise: Promise<AmapPlaceSearch> | null = null

function getPlaceSearch(): Promise<AmapPlaceSearch> {
  if (!placeSearchPromise) {
    placeSearchPromise = AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY || '',
      version: '2.0',
      plugins: ['AMap.PlaceSearch'],
    }).then((loaded) => {
      const AMap = loaded as AmapNamespace
      return new AMap.PlaceSearch({
        city: DEFAULT_CITY,
        citylimit: true,
        pageSize: PAGE_SIZE,
      })
    })
  }
  return placeSearchPromise
}

function normalizePoi(raw: AmapRawPoi): AmapPoi | null {
  if (!raw.id || !raw.location) {
    return null
  }

  return {
    poiId: raw.id,
    name: raw.name,
    // 高德的 type 形如「餐饮服务;中餐厅;火锅店」，取最细一级作为分类展示
    category: raw.type?.split(';').filter(Boolean).pop() || '其他',
    address: Array.isArray(raw.address) ? raw.address.join('') : raw.address || '',
    lng: raw.location.lng,
    lat: raw.location.lat,
    phone: raw.tel || undefined,
  }
}

export const amapService = {
  async searchPoi(keyword: string): Promise<AmapPoi[]> {
    const placeSearch = await getPlaceSearch()

    const pois = await new Promise<AmapRawPoi[]>((resolve, reject) => {
      placeSearch.search(keyword, (status, result) => {
        if (status === 'complete') {
          resolve((typeof result === 'string' ? [] : result?.poiList?.pois) || [])
          return
        }
        // 关键词无匹配时高德也返回 no_data，这属于正常空结果而非失败
        if (status === 'no_data') {
          resolve([])
          return
        }
        reject(new Error(typeof result === 'string' ? result : '高德 POI 搜索失败'))
      })
    })

    return pois.map(normalizePoi).filter((poi): poi is AmapPoi => poi !== null)
  },
}
