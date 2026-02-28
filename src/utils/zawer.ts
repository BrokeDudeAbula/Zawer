/**
 * 根据 Zawer 指数获取对应颜色
 */
export function getZawerColor(zawerIndex: number): string {
  if (zawerIndex >= 4.0) return '#ef4444'
  if (zawerIndex >= 3.0) return '#f97316'
  if (zawerIndex >= 2.5) return '#eab308'
  if (zawerIndex >= 1.5) return '#22c55e'
  return '#10b981'
}

/**
 * 根据 Zawer 指数获取等级标签
 */
export function getZawerLabel(zawerIndex: number): string {
  if (zawerIndex >= 4.0) return '极度Zawer'
  if (zawerIndex >= 3.0) return '比较Zawer'
  if (zawerIndex >= 2.5) return '一般'
  if (zawerIndex >= 1.5) return '还行'
  return '不Zawer'
}

/**
 * 根据 Zawer 指数获取表情
 */
export function getZawerEmoji(zawerIndex: number): string {
  if (zawerIndex >= 4.0) return '😡'
  if (zawerIndex >= 3.0) return '😤'
  if (zawerIndex >= 2.5) return '😐'
  if (zawerIndex >= 1.5) return '😊'
  return '😍'
}
