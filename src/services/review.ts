import type { Review, PaginatedResponse } from '@/types'
import request from '@/services/request'

export const reviewService = {
  async getByMerchantId(
    merchantId: string,
    page = 1,
    pageSize = 10,
    sortBy: 'time' | 'rating' = 'time',
  ): Promise<PaginatedResponse<Review>> {
    const response = await request.get(`/reviews/merchant/${merchantId}`, {
      params: { page, pageSize, sortBy },
    })
    return response as unknown as PaginatedResponse<Review>
  },

  async addReview(review: Omit<Review, 'id' | 'likes' | 'createdAt'>): Promise<Review> {
    const response = await request.post('/reviews', review)
    return response as unknown as Review
  },

  async likeReview(reviewId: string): Promise<void> {
    await request.post(`/reviews/${reviewId}/like`)
  },
}
