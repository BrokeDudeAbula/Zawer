import { useRef, useCallback } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    ((...args: any[]) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    }) as T,
    [fn, delay],
  )
}
