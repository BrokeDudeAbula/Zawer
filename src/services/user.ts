import type { User } from '@/types/user'
import request from '@/services/request'

export const userService = {
  async login(phone: string, code: string): Promise<{ user: User; token: string }> {
    const response = await request.post('/auth/login', { phone, code })
    return response as unknown as { user: User; token: string }
  },

  async sendCode(phone: string): Promise<void> {
    await request.post('/auth/send-code', { phone })
  },

  async getProfile(): Promise<User> {
    const response = await request.get('/users/me')
    return response as unknown as User
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await request.put('/users/me', data)
    return response as unknown as User
  },
}
