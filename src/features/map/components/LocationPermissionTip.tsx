interface LocationPermissionTipProps {
  error: string | null
  permissionDenied: boolean
  onRetry: () => void
}

export default function LocationPermissionTip({
  error,
  permissionDenied,
  onRetry,
}: LocationPermissionTipProps) {
  if (!error) return null

  return (
    <div className="absolute left-4 right-4 top-4 z-50 rounded-lg bg-white p-3 shadow-lg">
      <div className="flex items-start gap-3">
        <span className="text-xl">{permissionDenied ? '📍' : '⚠️'}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {permissionDenied ? '定位权限未授权' : '定位失败'}
          </p>
          <p className="mt-1 text-xs text-gray-500">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    </div>
  )
}
