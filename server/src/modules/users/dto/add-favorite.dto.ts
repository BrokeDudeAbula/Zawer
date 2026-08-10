import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class AddFavoriteDto {
  // 商家 ID 可能是自有 UUID，也可能是尚未入库商家的高德 POI ID，故不限定 UUID 格式
  @ApiProperty({ description: '商家 ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  merchantId: string
}
