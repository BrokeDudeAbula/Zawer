import type { Review, PaginatedResponse } from '@/types'
import request from '@/services/request'

export interface CreateReviewPayload {
  merchantId: string
  rating: number
  content: string
  dimensionRatings?: Review['dimensionRatings']
  images?: string[]
}

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

  async addReview(review: CreateReviewPayload): Promise<Review> {
    const response = await request.post('/reviews', review)
    return response as unknown as Review
  },

  async likeReview(reviewId: string): Promise<void> {
    await request.post(`/reviews/${reviewId}/like`)
  },
}
