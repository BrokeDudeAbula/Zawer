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

// 商家类型
export interface Merchant {
  id: string
  name: string
  category: string
  address: string
  lng: number
  lat: number
  // 被多少人点过 Zawer，越大越坑
  zawerCount: number
  phone?: string
  businessHours?: string
  images?: string[]
}

// 高德 POI 搜索返回的商家（真实数据，不含 Zawer 评分）
export interface AmapPoi {
  poiId: string
  name: string
  category: string
  address: string
  lng: number
  lat: number
  phone?: string
  // 距用户的直线距离（米）。周边搜索由高德给出，全城搜索时前端计算
  distance?: number
}

export interface PoiSearchResult {
  pois: AmapPoi[]
  // 周边无结果而退回全城搜索时为 true，用于向用户说明排序范围已改变
  fellBackToCity: boolean
}

// 后端按 POI ID 返回的自有 Zawer 计数
export interface PoiScore {
  merchantId: string
  zawerCount: number
}

// 搜索结果：高德的店铺信息 + 自有计数（无人点过时 score 为 null）
export interface MerchantSearchResult extends AmapPoi {
  score: PoiScore | null
}

// 投票切换结果
export interface ToggleVoteResult {
  voted: boolean
  zawerCount: number
  merchantId: string
}

// 商家的吐槽（来自填了内容的投票）
export interface ZawerComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  comment: string
  createdAt: string
}

// 我点过 Zawer 的记录
export interface MyVote {
  id: string
  merchantId: string
  merchantName: string
  category: string
  zawerCount: number
  comment: string | null
  createdAt: string
}
