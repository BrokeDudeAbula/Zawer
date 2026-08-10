import { getZawerColor, getZawerEmoji, getZawerLabel } from '@/utils/zawer'

interface ZawerCountProps {
  zawerCount: number
}

export default function ZawerCount({ zawerCount }: ZawerCountProps) {
  const color = getZawerColor(zawerCount)

  return (
    <div className="flex items-center gap-4">
      <span className="text-4xl leading-none">{getZawerEmoji(zawerCount)}</span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-normal leading-none" style={{ color }}>
            {zawerCount}
          </span>
          <span className="text-gm-base text-ink-secondary">人说坑</span>
        </div>
        <div className="mt-1.5 text-gm-base font-medium" style={{ color }}>
          {getZawerLabel(zawerCount)}
        </div>
      </div>
    </div>
  )
}
