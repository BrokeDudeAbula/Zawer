export default function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        {/* 地图图标骨架 */}
        <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200" />
        {/* 加载文字 */}
        <div className="mx-auto mb-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-3 w-48 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}
