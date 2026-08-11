import { Link } from 'react-router-dom'
import { MerchantSearchResult } from '@/types/api'
import { getZawerColor, getZawerLabel } from '@/utils/zawer'

interface SearchResultItemProps {
  result: MerchantSearchResult
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export default function SearchResultItem({ result }: SearchResultItemProps) {
  const { score } = result

  // 已被评分过的店走自有商家详情，未被评分的店只能凭 POI ID 进入
  const target = score ? `/merchant/${score.merchantId}` : `/merchant/${result.poiId}`

  return (
    <Link
      to={target}
      state={{ poi: result, score }}
      className="flex items-start gap-3 border-b border-outline px-4 py-3 transition-colors hover:bg-surface-hover"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-variant">
        <svg className="h-5 w-5 text-ink-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-gm-lg text-ink-primary">{result.name}</h3>

        <div className="mt-0.5 flex items-center gap-1.5 text-gm-base text-ink-secondary">
          {score && score.zawerCount > 0 ? (
            <>
              <span className="font-medium" style={{ color: getZawerColor(score.zawerCount) }}>
                {score.zawerCount} 人说坑
              </span>
              <span
                className="rounded-pill px-1.5 py-0.5 text-gm-xs font-medium text-white"
                style={{ backgroundColor: getZawerColor(score.zawerCount) }}
              >
                {getZawerLabel(score.zawerCount)}
              </span>
            </>
          ) : (
            <span className="text-ink-tertiary">还没人说坑</span>
          )}
        </div>

        <p className="mt-0.5 truncate text-gm-base text-ink-secondary">
          {result.distance !== undefined && (
            <span className="text-ink-primary">{formatDistance(result.distance)} · </span>
          )}
          {result.category} · {result.address}
        </p>
      </div>
    </Link>
  )
}
