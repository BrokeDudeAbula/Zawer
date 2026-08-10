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
    <div className="absolute inset-x-3 bottom-6 z-30 rounded-gm bg-ink-primary px-4 py-3 shadow-gm-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-gm-base font-medium text-white">
            {permissionDenied ? '定位权限未授权' : '定位失败'}
          </p>
          <p className="mt-0.5 text-gm-sm text-white/70">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="flex-shrink-0 rounded-pill px-3 py-1.5 text-gm-base font-medium text-[#8ab4f8] transition-colors hover:bg-white/10"
        >
          重试
        </button>
      </div>
    </div>
  )
}
