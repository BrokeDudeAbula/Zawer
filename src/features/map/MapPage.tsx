import { useState, useCallback, useRef } from 'react'
import type { Merchant } from '@/types'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useMerchants } from '@/hooks/useMerchants'
import MapContainer from './components/MapContainer'
import LocationMarker from './components/LocationMarker'
import LocationPermissionTip from './components/LocationPermissionTip'
import MerchantMarkers from './components/MerchantMarkers'
import MerchantInfoCard from './components/MerchantInfoCard'
import LocateButton from './components/LocateButton'

export default function MapPage() {
  const mapRef = useRef<any>(null)
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)

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
            merchants={merchants}
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
