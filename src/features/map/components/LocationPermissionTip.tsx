interface LocationPermissionTipProps {
  error: string | null
  accuracy: number | null
  permissionDenied: boolean
  onRetry: () => void
}

const LOW_ACCURACY_THRESHOLD_METERS = 200

export default function LocationPermissionTip({
  error,
  accuracy,
  permissionDenied,
  onRetry,
}: LocationPermissionTipProps) {
  const hasLowAccuracy = accuracy !== null && accuracy > LOW_ACCURACY_THRESHOLD_METERS
  if (!error && !hasLowAccuracy) return null

  const title = error ? (permissionDenied ? '定位权限未授权' : '定位失败') : '定位精度较低'
  const detail = error
    ? error
    : `当前误差约 ${Math.round(accuracy ?? 0)} 米，请开启系统精确定位后重试`

  return (
    <div
      role={error ? 'alert' : 'status'}
      className="absolute inset-x-3 bottom-6 z-30 rounded-gm bg-ink-primary px-4 py-3 shadow-gm-3"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-gm-base font-medium text-white">{title}</p>
          <p className="mt-0.5 text-gm-sm text-white/70">{detail}</p>
        </div>
        <button
          onClick={onRetry}
          className="flex-shrink-0 rounded-pill px-3 py-1.5 text-gm-base font-medium text-[#8ab4f8] transition-colors hover:bg-white/10"
        >
          {error ? '重试' : '重新定位'}
        </button>
      </div>
    </div>
  )
}
