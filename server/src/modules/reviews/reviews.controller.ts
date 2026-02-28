import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: '获取商家点评列表' })
  @ApiParam({ name: 'merchantId', description: '商家ID' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: '排序方式: time(时间) 或 rating(评分)', example: 'time' })
  async getMerchantReviews(
    @Param('merchantId') merchantId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('sortBy') sortBy?: 'time' | 'rating',
  ) {
    return this.reviewsService.getByMerchantId(
      merchantId,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 10,
      sortBy || 'time',
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建点评' })
  async createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  @Post(':id/like')
  @ApiOperation({ summary: '点赞点评' })
  @ApiParam({ name: 'id', description: '点评ID' })
  async likeReview(@Param('id') id: string) {
    return this.reviewsService.like(id);
  }
}
