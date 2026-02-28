export interface User {
  id: string
  phone: string
  nickname: string
  avatar?: string
  createdAt: string
  reviewCount: number
  likeCount: number
  favoriteCount: number
}

export interface LoginParams {
  phone: string
  code: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
}
