import type { Merchant, PaginatedResponse } from '@/types'

// Mock 商家数据
const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: '老王火锅',
    category: '餐饮',
    address: '成都市锦江区春熙路 88 号',
    lng: 104.0817,
    lat: 30.6571,
    zawerIndex: 4.5,
    reviewCount: 128,
    phone: '028-88888888',
    businessHours: '11:00-22:00',
  },
  {
    id: '2',
    name: '张姐串串',
    category: '餐饮',
    address: '成都市武侯区科华北路 66 号',
    lng: 104.0731,
    lat: 30.6340,
    zawerIndex: 2.1,
    reviewCount: 56,
    phone: '028-66666666',
    businessHours: '17:00-02:00',
  },
  {
    id: '3',
    name: '如家快捷酒店',
    category: '住宿',
    address: '成都市青羊区人民中路 100 号',
    lng: 104.0635,
    lat: 30.6727,
    zawerIndex: 3.8,
    reviewCount: 89,
    phone: '028-77777777',
    businessHours: '24小时',
  },
]

// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const merchantService = {
  async getList(): Promise<PaginatedResponse<Merchant>> {
    await delay(300)
    return {
      list: mockMerchants,
      total: mockMerchants.length,
      page: 1,
      pageSize: 20,
    }
  },

  async getById(id: string): Promise<Merchant | undefined> {
    await delay(200)
    return mockMerchants.find((m) => m.id === id)
  },

  async search(keyword: string): Promise<Merchant[]> {
    await delay(300)
    return mockMerchants.filter(
      (m) => m.name.includes(keyword) || m.address.includes(keyword),
    )
  },
}
