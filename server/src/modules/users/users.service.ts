import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity'
import { Favorite } from '../../entities/favorite.entity'
import { Merchant } from '../../entities/merchant.entity'
import { ZawerVote } from '../../entities/zawer-vote.entity'

export interface UserWithCounts extends User {
  zawerVoteCount: number
  favoriteCount: number
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(ZawerVote)
    private voteRepository: Repository<ZawerVote>,
  ) {}

  async getProfile(userId: string): Promise<UserWithCounts> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const [zawerVoteCount, favoriteCount] = await Promise.all([
      this.voteRepository.count({ where: { userId } }),
      this.favoriteRepository.count({ where: { userId } }),
    ])

    return {
      ...user,
      zawerVoteCount,
      favoriteCount,
    }
  }

  async updateProfile(userId: string, dto: { nickname?: string; avatar?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    if (dto.nickname !== undefined) {
      user.nickname = dto.nickname
    }
    if (dto.avatar !== undefined) {
      user.avatar = dto.avatar
    }

    await this.userRepository.save(user)
    return this.getProfile(userId)
  }

  async getFavorites(userId: string) {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['merchant'],
    })

    const merchants = favorites.map((fav) => fav.merchant)
    return { list: merchants, total: merchants.length }
  }

  async addFavorite(userId: string, merchantId: string) {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, merchantId },
    })

    if (existingFavorite) {
      return { success: true, message: '已收藏' }
    }

    const favorite = this.favoriteRepository.create({ userId, merchantId })
    await this.favoriteRepository.save(favorite)
    return { success: true }
  }

  async removeFavorite(userId: string, merchantId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, merchantId },
    })

    if (!favorite) {
      throw new NotFoundException('收藏不存在')
    }

    await this.favoriteRepository.remove(favorite)
    return { success: true }
  }

  async checkFavorite(userId: string, merchantId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, merchantId },
    })

    return { isFavorited: !!favorite }
  }
}
