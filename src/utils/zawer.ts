// Zawer 是计数而非评分：被多少人点过「坑」。分档阈值取较小值，便于早期数据量下也能形成区分度
const TIERS = [
  { min: 10, color: '#d93025', label: '极度Zawer', emoji: '😡' },
  { min: 3, color: '#e8710a', label: '比较Zawer', emoji: '😤' },
  { min: 1, color: '#f9ab00', label: '有人踩过', emoji: '😐' },
  { min: 0, color: '#5f6368', label: '暂无人踩', emoji: '🤔' },
]

const FALLBACK_TIER = { min: 0, color: '#5f6368', label: '暂无人踩', emoji: '🤔' }

function getTier(zawerCount: number) {
  return TIERS.find((tier) => zawerCount >= tier.min) ?? FALLBACK_TIER
}

export function getZawerColor(zawerCount: number): string {
  return getTier(zawerCount).color
}

export function getZawerLabel(zawerCount: number): string {
  return getTier(zawerCount).label
}

export function getZawerEmoji(zawerCount: number): string {
  return getTier(zawerCount).emoji
}

// 热力图与标记尺寸都需要 0~1 的相对强度，按当前视野内最大值归一化
export function getZawerIntensity(zawerCount: number, maxCount: number): number {
  if (maxCount <= 0) return 0
  return Math.min(1, zawerCount / maxCount)
}
