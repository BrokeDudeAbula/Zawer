import { useState, useEffect, useCallback } from 'react'
import type { Merchant } from '@/types'
import { merchantService } from '@/services'

// npm run demo 会并行拉起前后端，而 Vite 只要百余毫秒、NestJS 要先编译（约半分钟）。
// 首次请求几乎必然打在后端就绪之前，因此这里自动退避重试，避免界面停在空状态。
// 退避序列 0/1/3/7/15/31/63 秒，最后一次尝试要留在后端就绪（实测约 30 余秒）之后
const MAX_RETRIES = 6
const RETRY_BASE_MS = 1000

export function useMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMerchants = useCallback(async () => {
    setLoading(true)
    setError(null)

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await merchantService.getList()
        setMerchants(result.list)
        setLoading(false)
        return
      } catch (err) {
        if (attempt === MAX_RETRIES) {
          console.error('[Merchants] 加载失败:', err)
          setError('商家数据加载失败')
          setLoading(false)
          return
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_MS * 2 ** attempt))
      }
    }
  }, [])

  useEffect(() => {
    loadMerchants()
  }, [loadMerchants])

  return { merchants, loading, error, reload: loadMerchants }
}
