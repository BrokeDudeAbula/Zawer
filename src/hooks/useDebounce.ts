import { useRef, useCallback, useEffect } from 'react'

export function useDebounce<T extends (...args: never[]) => unknown>(fn: T, delay: number): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)

  // 调用方通常内联传入回调，每次渲染都是新引用。存进 ref 可以让返回的防抖函数
  // 保持稳定引用，否则把它放进 useEffect 依赖会造成无限重渲染。
  fnRef.current = fn

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    }) as T,
    [delay],
  )
}
