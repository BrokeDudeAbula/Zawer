import type { Merchant, PaginatedResponse } from '@/types'
import type { PoiScore } from '@/types/api'
import request from '@/services/request'

export const merchantService = {
  async getList(params?: {
    page?: number
    pageSize?: number
    category?: string
    zawerMin?: number
    zawerMax?: number
    lng?: number
    lat?: number
    distance?: number
  }): Promise<PaginatedResponse<Merchant>> {
    const response = await request.get('/merchants', { params })
    return response as unknown as PaginatedResponse<Merchant>
  },

  async getById(id: string): Promise<Merchant> {
    const response = await request.get(`/merchants/${id}`)
    return response as unknown as Merchant
  },

  async search(keyword: string): Promise<Merchant[]> {
    const response = await request.get('/merchants/search', { params: { keyword } })
    return response as unknown as Merchant[]
  },

  async getScoresByPoiIds(poiIds: string[]): Promise<Record<string, PoiScore>> {
    if (poiIds.length === 0) {
      return {}
    }
    const response = await request.post('/merchants/scores', { poiIds })
    return response as unknown as Record<string, PoiScore>
  },
}
