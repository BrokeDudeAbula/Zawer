import { DimensionRatings } from '@/types/api'

interface DimensionBarProps {
  ratings: DimensionRatings
}

const dimensionLabels: Record<keyof DimensionRatings, string> = {
  environment: '环境',
  service: '服务',
  price: '价格',
  quality: '质量'
}

function getBarColor(score: number): string {
  if (score >= 4.0) return '#ef4444'
  if (score >= 3.0) return '#f97316'
  if (score >= 2.5) return '#eab308'
  if (score >= 1.5) return '#22c55e'
  return '#10b981'
}

export default function DimensionBar({ ratings }: DimensionBarProps) {
  const dimensions = Object.keys(ratings) as (keyof DimensionRatings)[]

  return (
    <div className="space-y-3">
      {dimensions.map((dimension) => {
        const score = ratings[dimension]
        const percentage = (score / 5) * 100
        const color = getBarColor(score)

        return (
          <div key={dimension} className="flex items-center gap-3">
            <div className="w-12 text-sm font-medium text-gray-700">
              {dimensionLabels[dimension]}
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className="w-10 text-right text-sm font-semibold text-gray-900">
              {score.toFixed(1)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
