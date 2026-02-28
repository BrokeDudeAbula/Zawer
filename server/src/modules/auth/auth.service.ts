import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { Review } from '../../entities/review.entity';
import { Favorite } from '../../entities/favorite.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private jwtService: JwtService,
  ) {}

  async sendCode(phone: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async login(phone: string, code: string) {
    if (code !== '1234') {
      throw new UnauthorizedException('验证码错误');
    }

    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      user = this.userRepository.create({ phone });
      await this.userRepository.save(user);
    }

    const token = this.generateToken(user.id, user.phone);
    const userWithCounts = await this.getUserWithCounts(user.id);

    return { user: userWithCounts, token };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  private generateToken(userId: string, phone: string): string {
    const payload = { sub: userId, phone };
    return this.jwtService.sign(payload);
  }

  private async getUserWithCounts(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const [reviewCount, favoriteCount] = await Promise.all([
      this.reviewRepository.count({ where: { userId } }),
      this.favoriteRepository.count({ where: { userId } }),
    ]);

    (user as any).reviewCount = reviewCount;
    (user as any).likeCount = 0;
    (user as any).favoriteCount = favoriteCount;

    return user;
  }
}
