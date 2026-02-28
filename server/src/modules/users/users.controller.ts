import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  health() {
    return { status: 'ok', module: 'users' };
  }
}
