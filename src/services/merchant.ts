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
  {
    id: '4',
    name: '星巴克春熙路店',
    category: '餐饮',
    address: '成都市锦江区春熙路 128 号',
    lng: 104.0825,
    lat: 30.6558,
    zawerIndex: 3.2,
    reviewCount: 45,
    phone: '028-55555555',
    businessHours: '08:00-22:00',
  },
  {
    id: '5',
    name: '成都大熊猫基地',
    category: '娱乐',
    address: '成都市成华区熊猫大道 1375 号',
    lng: 104.1469,
    lat: 30.7328,
    zawerIndex: 1.2,
    reviewCount: 2340,
    phone: '028-83510033',
    businessHours: '07:30-18:00',
  },
  {
    id: '6',
    name: '宽窄巷子停车场',
    category: '出行',
    address: '成都市青羊区宽窄巷子旁',
    lng: 104.0555,
    lat: 30.6697,
    zawerIndex: 4.8,
    reviewCount: 312,
    phone: '028-11111111',
    businessHours: '24小时',
  },
  {
    id: '7',
    name: '太古里优衣库',
    category: '购物',
    address: '成都市锦江区中纱帽街 8 号',
    lng: 104.0843,
    lat: 30.6535,
    zawerIndex: 2.8,
    reviewCount: 167,
    phone: '028-22222222',
    businessHours: '10:00-22:00',
  },
  {
    id: '8',
    name: '锦里古街小吃',
    category: '餐饮',
    address: '成都市武侯区武侯祠大街 231 号',
    lng: 104.0479,
    lat: 30.6459,
    zawerIndex: 4.2,
    reviewCount: 567,
    phone: '028-33333333',
    businessHours: '09:00-21:00',
  },
  {
    id: '9',
    name: '全季酒店天府广场店',
    category: '住宿',
    address: '成都市青羊区人民南路一段 86 号',
    lng: 104.0658,
    lat: 30.6573,
    zawerIndex: 1.8,
    reviewCount: 203,
    phone: '028-44444444',
    businessHours: '24小时',
  },
  {
    id: '10',
    name: '九眼桥酒吧街',
    category: '娱乐',
    address: '成都市锦江区九眼桥',
    lng: 104.0891,
    lat: 30.6432,
    zawerIndex: 3.9,
    reviewCount: 445,
    businessHours: '20:00-04:00',
  },
  {
    id: '11',
    name: '伊藤洋华堂',
    category: '购物',
    address: '成都市锦江区春熙路 68 号',
    lng: 104.0798,
    lat: 30.6589,
    zawerIndex: 2.3,
    reviewCount: 89,
    phone: '028-99999999',
    businessHours: '09:30-21:30',
  },
  {
    id: '12',
    name: '滴滴出行成都站',
    category: '出行',
    address: '成都市武侯区天府大道北段',
    lng: 104.0726,
    lat: 30.6345,
    zawerIndex: 3.5,
    reviewCount: 1023,
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
