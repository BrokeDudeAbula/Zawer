import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: '验证码', example: '1234' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
