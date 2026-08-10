import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { User } from '../../entities/user.entity'
import { ZawerVote } from '../../entities/zawer-vote.entity'
import { Favorite } from '../../entities/favorite.entity'

export interface UserWithCounts extends User {
  zawerVoteCount: number
  likeCount: number
  favoriteCount: number
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ZawerVote)
    private voteRepository: Repository<ZawerVote>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private jwtService: JwtService,
  ) {}

  async sendCode(_phone: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async login(phone: string, code: string) {
    if (code !== '1234') {
      throw new UnauthorizedException('验证码错误')
    }

    let user = await this.userRepository.findOne({ where: { phone } })

    if (!user) {
      const nickname = `用户${phone.slice(-4)}`
      user = this.userRepository.create({ phone, nickname })
      await this.userRepository.save(user)
    }

    const token = this.generateToken(user.id, user.phone)
    const userWithCounts = await this.getUserWithCounts(user.id)

    return { user: userWithCounts, token }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } })
  }

  private generateToken(userId: string, phone: string): string {
    const payload = { sub: userId, phone }
    return this.jwtService.sign(payload)
  }

  private async getUserWithCounts(userId: string): Promise<UserWithCounts> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    const [zawerVoteCount, favoriteCount] = await Promise.all([
      this.voteRepository.count({ where: { userId } }),
      this.favoriteRepository.count({ where: { userId } }),
    ])

    return {
      ...user,
      zawerVoteCount,
      likeCount: 0,
      favoriteCount,
    }
  }
}
