import type { User } from '@/types/user'

// Mock 用户数据
const mockUser: User = {
  id: 'mock-user-001',
  phone: '',
  nickname: '测试用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  createdAt: new Date().toISOString(),
  reviewCount: 5,
  likeCount: 23,
  favoriteCount: 12
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  /**
   * 模拟登录
   * 任意手机号 + 验证码 "1234" 即可登录
   */
  login: async (phone: string, code: string): Promise<{ user: User; token: string }> => {
    await delay(500)

    if (code !== '1234') {
      throw new Error('验证码错误')
    }

    const user: User = {
      ...mockUser,
      id: `user-${Date.now()}`,
      phone,
      nickname: `用户${phone.slice(-4)}`
    }

    const token = `mock-token-${Date.now()}`

    return { user, token }
  },

  /**
   * 发送验证码
   */
  sendCode: async (_phone: string): Promise<void> => {
    await delay(300)
    // 直接返回成功
  },

  /**
   * 获取当前用户信息
   */
  getProfile: async (): Promise<User> => {
    await delay(300)
    return mockUser
  },

  /**
   * 更新用户信息
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    await delay(300)
    return {
      ...mockUser,
      ...data
    }
  }
}
