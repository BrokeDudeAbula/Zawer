import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Merchant } from '@/types'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useMerchants } from '@/hooks/useMerchants'
import { useAppStore } from '@/stores/app-store'
import { calculateDistance } from '@/utils/geo'
import MapContainer from './components/MapContainer'
import LocationMarker from './components/LocationMarker'
import LocationPermissionTip from './components/LocationPermissionTip'
import MerchantMarkers from './components/MerchantMarkers'
import ZawerHeatmap from './components/ZawerHeatmap'
import MerchantInfoCard from './components/MerchantInfoCard'
import LocateButton from './components/LocateButton'
import MapSearchBar from './components/MapSearchBar'
import CategoryChips from './components/CategoryChips'
import { FilterPanel } from './components/FilterPanel'

export default function MapPage() {
  // 地图实例必须是 state：存进 ref 不会触发重渲染，依赖它的图层（热力图、定位点、标注）
  // 就只能靠其它 state 变化偶然挂载，刷新页面时经常整片消失
  const [map, setMap] = useState<any>(null)
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 定位
  const {
    position: userPosition,
    error: locationError,
    permissionDenied,
    locate,
    loading: locationLoading,
  } = useGeolocation()

  // 商家数据（库中只存被评分过的真实商家）
  const {
    merchants,
    loading: merchantsLoading,
    error: merchantsError,
    reload: reloadMerchants,
  } = useMerchants()

  // 筛选条件
  const { filters, setFilters } = useAppStore()

  // 分类 chips 取自库中实际存在的商家分类，保证点选后一定有结果
  const availableCategories = useMemo(() => {
    return Array.from(new Set(merchants.map((merchant) => merchant.category))).slice(0, 12)
  }, [merchants])

  const handleCategoryToggle = useCallback(
    (category: string) => {
      const next = filters.category.includes(category)
        ? filters.category.filter((item) => item !== category)
        : [...filters.category, category]
      setFilters({ category: next })
    },
    [filters.category, setFilters],
  )

  // 应用筛选逻辑
  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      // 品类筛选
      if (filters.category.length > 0 && !filters.category.includes(merchant.category)) {
        return false
      }

      // Zawer 计数筛选
      if (merchant.zawerCount < filters.zawerMin) {
        return false
      }

      // 距离筛选
      if (userPosition && filters.distance !== 3000) {
        const distance = calculateDistance(
          userPosition.lat,
          userPosition.lng,
          merchant.lat,
          merchant.lng,
        )
        if (distance > filters.distance) {
          return false
        }
      }

      return true
    })
  }, [merchants, filters, userPosition])

  // 判断是否有活跃的筛选条件
  const hasActiveFilters = useMemo(() => {
    return filters.category.length > 0 || filters.zawerMin > 0 || filters.distance !== 3000
  }, [filters])

  // 地图就绪回调
  const handleMapReady = useCallback((instance: any) => {
    setMap((prev: any) => prev ?? instance)
  }, [])

  // 点击商家标注
  const handleMarkerClick = useCallback(
    (merchant: Merchant) => {
      setSelectedMerchant(merchant)
      // 平移地图到商家位置
      map?.panTo([merchant.lng, merchant.lat])
    },
    [map],
  )

  // 关闭信息卡片
  const handleCloseCard = useCallback(() => {
    setSelectedMerchant(null)
  }, [])

  // 回到我的位置
  const handleLocate = useCallback(() => {
    if (userPosition && map) {
      map.setZoomAndCenter(15, [userPosition.lng, userPosition.lat])
    } else {
      locate()
    }
  }, [userPosition, locate, map])

  // 地图中心点
  const center: [number, number] = userPosition
    ? [userPosition.lng, userPosition.lat]
    : [104.0657, 30.6595]

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={14} onMapReady={handleMapReady}>
        {/* 用户位置标记 */}
        {userPosition && map && <LocationMarker map={map} position={userPosition} />}

        {/* Zawer 热力图（在标注之下） */}
        {map && <ZawerHeatmap map={map} merchants={filteredMerchants} />}

        {/* 商家标注 */}
        {map && (
          <MerchantMarkers
            map={map}
            merchants={filteredMerchants}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </MapContainer>

      {/* 顶部悬浮层：搜索栏 + 分类 chips */}
      <div className="absolute inset-x-0 top-0 z-20 space-y-2 px-3 pt-3">
        <MapSearchBar />
        {availableCategories.length > 0 && (
          <CategoryChips
            categories={availableCategories}
            selected={filters.category}
            onToggle={handleCategoryToggle}
            onOpenFilter={() => setIsFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </div>

      {/* 加载失败与「确实没有商家」是两回事，必须分开提示，否则后端没起来时会误导成空数据 */}
      {!merchantsLoading && merchantsError && (
        <div className="absolute inset-x-0 top-20 z-10 flex justify-center px-4">
          <div className="max-w-xs rounded-gm-lg bg-white px-4 py-3 text-center shadow-gm-2">
            <p className="text-gm-base font-medium text-ink-primary">商家数据加载失败</p>
            <p className="mt-1 text-gm-sm text-ink-secondary">后端服务可能还没启动完成</p>
            <button
              onClick={reloadMerchants}
              className="mt-2.5 rounded-pill bg-gm-blue px-4 py-1.5 text-gm-base font-medium text-white transition-colors hover:bg-gm-blue-hover"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 空状态引导：库中尚无任何被评分的商家 */}
      {!merchantsLoading && !merchantsError && merchants.length === 0 && (
        <div className="absolute inset-x-0 top-20 z-10 flex justify-center px-4">
          <div className="max-w-xs rounded-gm-lg bg-white px-4 py-3 text-center shadow-gm-2">
            <p className="text-gm-base font-medium text-ink-primary">地图上还没有商家</p>
            <p className="mt-1 text-gm-sm text-ink-secondary">这里只显示被真人评过分的店</p>
            <Link
              to="/search"
              className="mt-2.5 inline-block rounded-pill bg-gm-blue px-4 py-1.5 text-gm-base font-medium text-white transition-colors hover:bg-gm-blue-hover"
            >
              去搜索并评分
            </Link>
          </div>
        </div>
      )}

      {/* 定位权限提示 */}
      <LocationPermissionTip
        error={locationError}
        permissionDenied={permissionDenied}
        onRetry={locate}
      />

      {/* 筛选面板 */}
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* 右下角悬浮按钮，位置随底部卡片是否显示调整 */}
      <div
        className={`absolute right-4 z-20 transition-all duration-200 ${
          selectedMerchant ? 'bottom-48' : 'bottom-6'
        }`}
      >
        <LocateButton onClick={handleLocate} loading={locationLoading} />
      </div>

      {/* 商家信息卡片 */}
      <MerchantInfoCard
        merchant={selectedMerchant}
        userPosition={userPosition}
        onClose={handleCloseCard}
      />
    </div>
  )
}
