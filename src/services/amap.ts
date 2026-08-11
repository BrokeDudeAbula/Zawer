import AMapLoader from '@amap/amap-jsapi-loader'
import type { AmapPoi, PoiSearchResult } from '@/types/api'
import { calculateDistance } from '@/utils/geo'

// 高德搜索默认限定城市，避免同名店铺在全国范围内命中
const DEFAULT_CITY = '成都'
const PAGE_SIZE = 20
// 周边搜索半径，超出这个范围才退回全城搜索
const NEARBY_RADIUS_METERS = 5000

interface AmapRawPoi {
  id: string
  name: string
  address?: string | string[]
  type?: string
  tel?: string
  distance?: number
  location?: { lng: number; lat: number }
}

interface AmapSearchResult {
  poiList?: { pois?: AmapRawPoi[] }
}

type SearchCallback = (status: string, result: AmapSearchResult | string) => void

interface AmapPlaceSearch {
  search(keyword: string, callback: SearchCallback): void
  searchNearBy(
    keyword: string,
    center: [number, number],
    radius: number,
    callback: SearchCallback,
  ): void
}

interface AmapNamespace {
  PlaceSearch: new (options: {
    city: string
    citylimit: boolean
    pageSize: number
  }) => AmapPlaceSearch
}

export interface SearchCenter {
  lng: number
  lat: number
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

// 高德的搜索方法都是回调风格，统一包一层便于串联「周边 → 全城」两级搜索
function runSearch(invoke: (callback: SearchCallback) => void): Promise<AmapRawPoi[]> {
  return new Promise((resolve, reject) => {
    invoke((status, result) => {
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
    distance: typeof raw.distance === 'number' ? raw.distance : undefined,
  }
}

function normalizeAll(raws: AmapRawPoi[]): AmapPoi[] {
  return raws.map(normalizePoi).filter((poi): poi is AmapPoi => poi !== null)
}

// 全城搜索由高德按相关度返回，需要自己补算距离再排序
function sortByDistance(pois: AmapPoi[], center: SearchCenter): AmapPoi[] {
  return pois
    .map((poi) => ({
      ...poi,
      distance: poi.distance ?? calculateDistance(center.lat, center.lng, poi.lat, poi.lng),
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
}

export const amapService = {
  async searchPoi(keyword: string, center?: SearchCenter | null): Promise<PoiSearchResult> {
    const placeSearch = await getPlaceSearch()

    // 有定位时优先周边搜索，高德会直接按距离由近到远返回
    if (center) {
      const nearby = await runSearch((callback) =>
        placeSearch.searchNearBy(keyword, [center.lng, center.lat], NEARBY_RADIUS_METERS, callback),
      )

      if (nearby.length > 0) {
        return { pois: normalizeAll(nearby), fellBackToCity: false }
      }
    }

    const cityWide = normalizeAll(
      await runSearch((callback) => placeSearch.search(keyword, callback)),
    )

    return {
      pois: center ? sortByDistance(cityWide, center) : cityWide,
      // 没有定位时本就是全城搜索，不算降级
      fellBackToCity: Boolean(center),
    }
  },
}
