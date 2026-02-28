import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-code')
  @ApiOperation({ summary: '发送验证码' })
  @ApiResponse({ status: 200, description: '发送成功' })
  async sendCode(@Body('phone') phone: string) {
    return this.authService.sendCode(phone);
  }

  @Post('login')
  @ApiOperation({ summary: '登录/注册' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.phone, loginDto.code);
  }
}
