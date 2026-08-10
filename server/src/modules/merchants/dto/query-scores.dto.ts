import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, ArrayMaxSize } from 'class-validator'

export class QueryScoresDto {
  @ApiProperty({
    description: '高德 POI ID 列表',
    example: ['B0FFFAB6J2', 'B0FFH8K1L9'],
    type: [String],
  })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  poiIds: string[]
}
