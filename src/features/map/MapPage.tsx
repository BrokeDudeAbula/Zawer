import { useState, useCallback, useRef, useMemo } from 'react'
import type { Merchant } from '@/types'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useMerchants } from '@/hooks/useMerchants'
import { useAppStore } from '@/stores/app-store'
import { calculateDistance } from '@/utils/geo'
import MapContainer from './components/MapContainer'
import LocationMarker from './components/LocationMarker'
import LocationPermissionTip from './components/LocationPermissionTip'
import MerchantMarkers from './components/MerchantMarkers'
import MerchantInfoCard from './components/MerchantInfoCard'
import LocateButton from './components/LocateButton'
import { FilterButton } from './components/FilterButton'
import { FilterPanel } from './components/FilterPanel'

export default function MapPage() {
  const mapRef = useRef<any>(null)
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

  // 商家数据
  const { merchants } = useMerchants()

  // 筛选条件
  const { filters } = useAppStore()

  // 应用筛选逻辑
  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      // 品类筛选
      if (filters.category.length > 0 && !filters.category.includes(merchant.category)) {
        return false
      }

      // Zawer 等级筛选
      if (
        merchant.zawerIndex < filters.zawerLevel[0] ||
        merchant.zawerIndex > filters.zawerLevel[1]
      ) {
        return false
      }

      // 距离筛选
      if (userPosition && filters.distance !== 3000) {
        const distance = calculateDistance(
          userPosition.lat,
          userPosition.lng,
          merchant.lat,
          merchant.lng
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
    return (
      filters.category.length > 0 ||
      filters.zawerLevel[0] !== 1 ||
      filters.zawerLevel[1] !== 5 ||
      filters.distance !== 3000
    )
  }, [filters])

  // 地图就绪回调
  const handleMapReady = useCallback((map: any) => {
    mapRef.current = map
  }, [])

  // 点击商家标注
  const handleMarkerClick = useCallback((merchant: Merchant) => {
    setSelectedMerchant(merchant)
    // 平移地图到商家位置
    if (mapRef.current) {
      mapRef.current.panTo([merchant.lng, merchant.lat])
    }
  }, [])

  // 关闭信息卡片
  const handleCloseCard = useCallback(() => {
    setSelectedMerchant(null)
  }, [])

  // 回到我的位置
  const handleLocate = useCallback(() => {
    if (userPosition && mapRef.current) {
      mapRef.current.setZoomAndCenter(15, [userPosition.lng, userPosition.lat])
    } else {
      locate()
    }
  }, [userPosition, locate])

  // 地图中心点
  const center: [number, number] = userPosition
    ? [userPosition.lng, userPosition.lat]
    : [104.0657, 30.6595]

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={14}
        onMapReady={handleMapReady}
      >
        {/* 用户位置标记 */}
        {userPosition && mapRef.current && (
          <LocationMarker map={mapRef.current} position={userPosition} />
        )}

        {/* 商家标注 */}
        {mapRef.current && (
          <MerchantMarkers
            map={mapRef.current}
            merchants={filteredMerchants}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </MapContainer>

      {/* 定位权限提示 */}
      <LocationPermissionTip
        error={locationError}
        permissionDenied={permissionDenied}
        onRetry={locate}
      />

      {/* 筛选按钮 */}
      <FilterButton
        onClick={() => setIsFilterOpen(true)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 筛选面板 */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* 回到我的位置按钮 */}
      <LocateButton onClick={handleLocate} loading={locationLoading} />

      {/* 商家信息卡片 */}
      <MerchantInfoCard
        merchant={selectedMerchant}
        userPosition={userPosition}
        onClose={handleCloseCard}
      />
    </div>
  )
}
