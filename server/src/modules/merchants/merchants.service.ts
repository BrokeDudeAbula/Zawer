import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, In } from 'typeorm'
import { Merchant } from '../../entities/merchant.entity'
import { QueryMerchantsDto } from './dto/query-merchants.dto'

export interface PoiScore {
  merchantId: string
  zawerCount: number
}

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  private parseJsonFields(merchant: Merchant): Merchant {
    const result = { ...merchant }

    if (result.images && typeof result.images === 'string') {
      try {
        result.images = JSON.parse(result.images)
      } catch {
        // 解析失败时保留原始字符串
      }
    }

    return result
  }

  private calculateDistance(lng1: number, lat1: number, lng2: number, lat2: number): number {
    const R = 6371000
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  async getList(query: QueryMerchantsDto) {
    const { page, pageSize, category, zawerMin, zawerMax, lng, lat, distance } = query

    const queryBuilder = this.merchantRepository.createQueryBuilder('merchant')

    if (category) {
      queryBuilder.andWhere('merchant.category = :category', { category })
    }

    if (zawerMin !== undefined) {
      queryBuilder.andWhere('merchant.zawerCount >= :zawerMin', { zawerMin })
    }

    if (zawerMax !== undefined) {
      queryBuilder.andWhere('merchant.zawerCount <= :zawerMax', { zawerMax })
    }

    const [merchants, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    let filteredMerchants = merchants.map(this.parseJsonFields)

    if (lng !== undefined && lat !== undefined && distance !== undefined) {
      filteredMerchants = filteredMerchants.filter((merchant) => {
        const dist = this.calculateDistance(lng, lat, merchant.lng, merchant.lat)
        return dist <= distance
      })
    }

    return {
      list: filteredMerchants,
      total,
      page,
      pageSize,
    }
  }

  async getById(id: string): Promise<Merchant> {
    // 入库后前端仍可能用 POI ID 访问（例如刷新页面丢失了路由状态），故按 POI ID 回退查找
    const merchant =
      (await this.merchantRepository.findOne({ where: { id } })) ??
      (await this.merchantRepository.findOne({ where: { amapPoiId: id } }))

    if (!merchant) {
      throw new NotFoundException(`Merchant with id ${id} not found`)
    }
    return this.parseJsonFields(merchant)
  }

  async search(keyword: string): Promise<Merchant[]> {
    const merchants = await this.merchantRepository.find({
      where: [{ name: Like(`%${keyword}%`) }, { address: Like(`%${keyword}%`) }],
    })
    return merchants.map(this.parseJsonFields)
  }

  async getScoresByPoiIds(poiIds: string[]): Promise<Record<string, PoiScore>> {
    if (poiIds.length === 0) {
      return {}
    }

    const merchants = await this.merchantRepository.find({
      where: { amapPoiId: In(poiIds) },
      select: ['id', 'amapPoiId', 'zawerCount'],
    })

    return merchants.reduce<Record<string, PoiScore>>((acc, merchant) => {
      if (merchant.amapPoiId) {
        acc[merchant.amapPoiId] = {
          merchantId: merchant.id,
          zawerCount: merchant.zawerCount,
        }
      }
      return acc
    }, {})
  }
}
