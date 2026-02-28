import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, Min, Max, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: '商家ID', example: 'uuid-string' })
  @IsString()
  merchantId: string;

  @ApiProperty({ description: '评分（1-5）', example: 4.5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '点评内容', example: '商家服务很好', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiProperty({
    description: '维度评分',
    required: false,
    example: { environment: 4, service: 5, price: 4, quality: 5 },
  })
  @IsOptional()
  dimensionRatings?: {
    environment?: number;
    service?: number;
    price?: number;
    quality?: number;
  };

  @ApiProperty({
    description: '图片URL列表',
    required: false,
    example: ['https://example.com/image1.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
