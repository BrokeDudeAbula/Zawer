// 通用 API 响应类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 多维度评分
export interface DimensionRatings {
  environment: number
  service: number
  price: number
  quality: number
}

// 商家类型
export interface Merchant {
  id: string
  name: string
  category: string
  address: string
  lng: number
  lat: number
  zawerIndex: number
  reviewCount: number
  phone?: string
  businessHours?: string
  images?: string[]
  dimensionRatings?: DimensionRatings
}

// 点评类型
export interface Review {
  id: string
  merchantId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  dimensionRatings?: DimensionRatings
  content: string
  images?: string[]
  likes: number
  createdAt: string
}
