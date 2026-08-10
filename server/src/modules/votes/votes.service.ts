import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ZawerVote } from '../../entities/zawer-vote.entity'
import { Merchant } from '../../entities/merchant.entity'
import { ToggleVoteDto } from './dto/toggle-vote.dto'

export interface ToggleVoteResult {
  voted: boolean
  zawerCount: number
  merchantId: string
}

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(ZawerVote)
    private voteRepository: Repository<ZawerVote>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  // 商家可能只存在于高德而尚未入库，首次被投票时才按 POI 信息落库
  private async resolveMerchant(merchantId: string, poi?: ToggleVoteDto['poi']): Promise<Merchant> {
    const existingById = await this.merchantRepository.findOne({ where: { id: merchantId } })
    if (existingById) {
      return existingById
    }

    // 入库后前端仍可能持有 POI ID（例如刷新页面丢失了路由状态），需按 POI ID 回退查找
    const existingByPoi = await this.merchantRepository.findOne({
      where: { amapPoiId: poi?.poiId ?? merchantId },
    })
    if (existingByPoi) {
      return existingByPoi
    }

    if (!poi) {
      throw new NotFoundException('商家不存在')
    }

    const created = this.merchantRepository.create({
      amapPoiId: poi.poiId,
      name: poi.name,
      category: poi.category || '其他',
      address: poi.address,
      lng: poi.lng,
      lat: poi.lat,
      phone: poi.phone,
      zawerCount: 0,
    })

    return this.merchantRepository.save(created)
  }

  private async syncCount(merchant: Merchant): Promise<number> {
    const count = await this.voteRepository.count({ where: { merchantId: merchant.id } })
    merchant.zawerCount = count
    await this.merchantRepository.save(merchant)
    return count
  }

  async toggle(userId: string, dto: ToggleVoteDto): Promise<ToggleVoteResult> {
    const merchant = await this.resolveMerchant(dto.merchantId, dto.poi)

    const existing = await this.voteRepository.findOne({
      where: { userId, merchantId: merchant.id },
    })

    if (existing) {
      await this.voteRepository.remove(existing)
      const zawerCount = await this.syncCount(merchant)
      return { voted: false, zawerCount, merchantId: merchant.id }
    }

    const vote = this.voteRepository.create({
      userId,
      merchantId: merchant.id,
      comment: dto.comment?.trim() || null,
    })
    await this.voteRepository.save(vote)

    const zawerCount = await this.syncCount(merchant)
    return { voted: true, zawerCount, merchantId: merchant.id }
  }

  async hasVoted(userId: string, merchantId: string): Promise<{ voted: boolean }> {
    const count = await this.voteRepository.count({ where: { userId, merchantId } })
    return { voted: count > 0 }
  }

  // 吐槽列表只返回填了内容的投票
  async getComments(merchantId: string, page = 1, pageSize = 10) {
    const [list, total] = await this.voteRepository
      .createQueryBuilder('vote')
      .leftJoinAndSelect('vote.user', 'user')
      .where('vote.merchantId = :merchantId', { merchantId })
      .andWhere('vote.comment IS NOT NULL')
      .andWhere("vote.comment != ''")
      .orderBy('vote.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    return {
      list: list.map((vote) => ({
        id: vote.id,
        userId: vote.userId,
        userName: vote.user?.nickname || '',
        userAvatar: vote.user?.avatar || '',
        comment: vote.comment,
        createdAt: vote.createdAt,
      })),
      total,
      page,
      pageSize,
    }
  }

  async getUserVotes(userId: string) {
    const votes = await this.voteRepository.find({
      where: { userId },
      relations: ['merchant'],
      order: { createdAt: 'DESC' },
    })

    return votes.map((vote) => ({
      id: vote.id,
      merchantId: vote.merchantId,
      merchantName: vote.merchant?.name || '',
      category: vote.merchant?.category || '',
      zawerCount: vote.merchant?.zawerCount ?? 0,
      comment: vote.comment,
      createdAt: vote.createdAt,
    }))
  }
}
