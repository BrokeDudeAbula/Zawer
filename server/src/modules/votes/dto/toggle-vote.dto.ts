import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  MaxLength,
} from 'class-validator'

export class VotePoiDto {
  @ApiProperty({ description: '高德 POI ID', example: 'B0FFFAB6J2' })
  @IsString()
  @IsNotEmpty()
  poiId: string

  @ApiProperty({ description: '商家名称', example: '蜀大侠火锅' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '分类', example: '火锅店' })
  @IsString()
  category: string

  @ApiProperty({ description: '地址' })
  @IsString()
  address: string

  @ApiProperty({ description: '经度', example: 104.0817 })
  @IsNumber()
  lng: number

  @ApiProperty({ description: '纬度', example: 30.6571 })
  @IsNumber()
  lat: number

  @ApiProperty({ description: '电话', required: false })
  @IsOptional()
  @IsString()
  phone?: string
}

export class ToggleVoteDto {
  @ApiProperty({ description: '商家 ID，未入库时传高德 POI ID' })
  @IsString()
  @IsNotEmpty()
  merchantId: string

  @ApiProperty({
    description: '高德 POI 信息，商家尚未入库时据此创建',
    required: false,
    type: VotePoiDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => VotePoiDto)
  poi?: VotePoiDto

  @ApiProperty({ description: '选填的吐槽内容', required: false, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string
}
