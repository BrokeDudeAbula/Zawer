import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  health() {
    return { status: 'ok', module: 'reviews' };
  }
}
