import type { Review, PaginatedResponse } from '@/types'

// Mock 点评数据
const mockReviews: Review[] = [
  {
    id: 'r1',
    merchantId: '1',
    userId: 'u1',
    userName: '美食达人小王',
    userAvatar: '',
    rating: 4.5,
    dimensionRatings: { environment: 4, service: 5, price: 4, quality: 5 },
    content: '这家火锅味道确实不错，但是价格偏贵，人均消费比周边同类店铺高出不少。服务态度很好，环境也干净整洁。',
    images: [],
    likes: 23,
    createdAt: '2026-02-25T10:30:00Z',
  },
  {
    id: 'r2',
    merchantId: '1',
    userId: 'u2',
    userName: '吃货小李',
    userAvatar: '',
    rating: 4.8,
    dimensionRatings: { environment: 5, service: 5, price: 4, quality: 5 },
    content: '排队等了一个小时，但是味道确实值得等待！锅底很香，菜品新鲜。就是价格有点小贵。',
    images: [],
    likes: 15,
    createdAt: '2026-02-20T18:45:00Z',
  },
  {
    id: 'r3',
    merchantId: '1',
    userId: 'u3',
    userName: '路过的游客',
    userAvatar: '',
    rating: 3.5,
    dimensionRatings: { environment: 3, service: 3, price: 4, quality: 4 },
    content: '一般般吧，没有网上说的那么好。可能是期望太高了。',
    images: [],
    likes: 5,
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'r4',
    merchantId: '2',
    userId: 'u1',
    userName: '美食达人小王',
    userAvatar: '',
    rating: 2.0,
    dimensionRatings: { environment: 2, service: 2, price: 2, quality: 2 },
    content: '串串味道不错，价格也很实惠！环境一般，但是胜在味道好。推荐牛肉串和鸡翅。',
    images: [],
    likes: 8,
    createdAt: '2026-02-22T20:15:00Z',
  },
  {
    id: 'r5',
    merchantId: '6',
    userId: 'u4',
    userName: '自驾游老张',
    userAvatar: '',
    rating: 4.9,
    dimensionRatings: { environment: 5, service: 5, price: 5, quality: 5 },
    content: '停车费贵得离谱！10块钱一小时，宽窄巷子逛一圈下来停车费比吃饭还贵。强烈不推荐自驾来这里。',
    images: [],
    likes: 156,
    createdAt: '2026-02-26T14:30:00Z',
  },
  {
    id: 'r6',
    merchantId: '8',
    userId: 'u5',
    userName: '成都本地人',
    userAvatar: '',
    rating: 4.0,
    dimensionRatings: { environment: 4, service: 3, price: 5, quality: 4 },
    content: '锦里的小吃价格虚高，味道也就那样。本地人根本不会来这里吃东西，都是游客在消费。',
    images: [],
    likes: 89,
    createdAt: '2026-02-24T16:00:00Z',
  },
  {
    id: 'r7',
    merchantId: '5',
    userId: 'u6',
    userName: '熊猫爱好者',
    userAvatar: '',
    rating: 1.0,
    dimensionRatings: { environment: 1, service: 1, price: 1, quality: 1 },
    content: '大熊猫基地真的太棒了！门票价格合理，熊猫们都很可爱。工作人员也很友善，设施完善。强烈推荐！',
    images: [],
    likes: 234,
    createdAt: '2026-02-27T09:00:00Z',
  },
  {
    id: 'r8',
    merchantId: '9',
    userId: 'u7',
    userName: '商旅达人',
    userAvatar: '',
    rating: 1.5,
    dimensionRatings: { environment: 2, service: 1, price: 2, quality: 2 },
    content: '全季酒店性价比很高，房间干净整洁，位置也很方便。前台服务态度好，早餐种类丰富。',
    images: [],
    likes: 12,
    createdAt: '2026-02-23T08:30:00Z',
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const reviewService = {
  async getByMerchantId(
    merchantId: string,
    page = 1,
    pageSize = 10,
    sortBy: 'time' | 'rating' = 'time',
  ): Promise<PaginatedResponse<Review>> {
    await delay(300)
    let reviews = mockReviews.filter((r) => r.merchantId === merchantId)

    if (sortBy === 'time') {
      reviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    } else {
      reviews.sort((a, b) => b.rating - a.rating)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      list: reviews.slice(start, end),
      total: reviews.length,
      page,
      pageSize,
    }
  },

  async addReview(review: Omit<Review, 'id' | 'likes' | 'createdAt'>): Promise<Review> {
    await delay(500)
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      likes: 0,
      createdAt: new Date().toISOString(),
    }
    mockReviews.unshift(newReview)
    return newReview
  },

  async likeReview(reviewId: string): Promise<void> {
    await delay(200)
    const review = mockReviews.find((r) => r.id === reviewId)
    if (review) {
      review.likes += 1
    }
  },
}
