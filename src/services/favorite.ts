import request from '@/services/request'
import { getStoredAuthToken } from '@/utils/auth'

export const favoriteService = {
  async getList(): Promise<string[]> {
    const token = getStoredAuthToken()
    if (!token) {
      return []
    }
    const response = await request.get('/users/me/favorites')
    const data = response as unknown as { list: Array<{ id: string }>; total: number }
    return data.list.map((m) => m.id)
  },

  async add(merchantId: string): Promise<void> {
    await request.post('/users/me/favorites', { merchantId })
  },

  async remove(merchantId: string): Promise<void> {
    await request.delete(`/users/me/favorites/${merchantId}`)
  },

  async isFavorited(merchantId: string): Promise<boolean> {
    const token = getStoredAuthToken()
    if (!token) {
      return false
    }
    const response = await request.get(`/users/me/favorites/${merchantId}/check`)
    const data = response as unknown as { isFavorited: boolean }
    return data.isFavorited
  },
}
