import { useState, useEffect, useCallback } from 'react'
import type { Merchant } from '@/types'
import { merchantService } from '@/services'

export function useMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMerchants = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await merchantService.getList()
      setMerchants(result.list)
    } catch (err) {
      console.error('[Merchants] 加载失败:', err)
      setError('商家数据加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMerchants()
  }, [loadMerchants])

  return { merchants, loading, error, reload: loadMerchants }
}
