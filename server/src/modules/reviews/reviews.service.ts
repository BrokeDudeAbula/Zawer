import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Merchant } from '../../entities/merchant.entity';
import { User } from '../../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getByMerchantId(
    merchantId: string,
    page: number = 1,
    pageSize: number = 10,
    sortBy: 'time' | 'rating' = 'time',
  ) {
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.merchantId = :merchantId', { merchantId });

    if (sortBy === 'time') {
      queryBuilder.orderBy('review.createdAt', 'DESC');
    } else if (sortBy === 'rating') {
      queryBuilder.orderBy('review.rating', 'DESC');
    }

    const [list, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const reviewList = list.map(review => ({
      ...review,
      userName: review.user?.nickname || '',
      userAvatar: review.user?.avatar || '',
    }));

    return {
      list: reviewList,
      total,
      page,
      pageSize,
    };
  }

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { merchantId, rating, content, dimensionRatings, images } = createReviewDto;

    const merchant = await this.merchantRepository.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('商家不存在');
    }

    const reviewData = {
      userId: userId,
      merchantId: merchantId,
      rating: rating,
      content: content,
      dimensionRatings: dimensionRatings ? JSON.stringify(dimensionRatings) : undefined,
      images: images ? JSON.stringify(images) : undefined,
      likes: 0,
      createdAt: new Date(),
    };
    const review = this.reviewRepository.create(reviewData);

    await this.reviewRepository.save(review);

    const allReviews = await this.reviewRepository.find({
      where: { merchantId },
    });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    merchant.reviewCount = allReviews.length;
    merchant.zawerIndex = parseFloat(avgRating.toFixed(2));

    await this.merchantRepository.save(merchant);

    return review;
  }

  async like(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('点评不存在');
    }

    review.likes += 1;
    await this.reviewRepository.save(review);

    return { likes: review.likes };
  }
}
