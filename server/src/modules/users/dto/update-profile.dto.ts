import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: '昵称', example: '张三', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '头像 URL', example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;
}
