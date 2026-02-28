import { getZawerColor, getZawerEmoji, getZawerLabel } from '@/utils/zawer'

interface ZawerScoreProps {
  zawerIndex: number
}

export default function ZawerScore({ zawerIndex }: ZawerScoreProps) {
  const color = getZawerColor(zawerIndex)
  const emoji = getZawerEmoji(zawerIndex)
  const label = getZawerLabel(zawerIndex)

  return (
    <div
      className="flex items-center justify-center rounded-2xl p-6 text-white shadow-lg"
      style={{ backgroundColor: color }}
    >
      <div className="text-center">
        <div className="mb-2 text-5xl">{emoji}</div>
        <div className="text-6xl font-bold">{zawerIndex.toFixed(1)}</div>
        <div className="mt-2 text-lg font-medium opacity-90">{label}</div>
      </div>
    </div>
  )
}
