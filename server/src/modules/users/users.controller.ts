import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('me/favorites')
  @ApiOperation({ summary: '获取收藏列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getFavorites(@Request() req) {
    return this.usersService.getFavorites(req.user.id);
  }

  @Post('me/favorites')
  @ApiOperation({ summary: '添加收藏' })
  @ApiResponse({ status: 200, description: '添加成功' })
  async addFavorite(@Request() req, @Body() dto: AddFavoriteDto) {
    return this.usersService.addFavorite(req.user.id, dto.merchantId);
  }

  @Delete('me/favorites/:merchantId')
  @ApiOperation({ summary: '取消收藏' })
  @ApiResponse({ status: 200, description: '取消成功' })
  async removeFavorite(@Request() req, @Param('merchantId') merchantId: string) {
    return this.usersService.removeFavorite(req.user.id, merchantId);
  }

  @Get('me/favorites/:merchantId/check')
  @ApiOperation({ summary: '检查收藏状态' })
  @ApiResponse({ status: 200, description: '检查成功' })
  async checkFavorite(@Request() req, @Param('merchantId') merchantId: string) {
    return this.usersService.checkFavorite(req.user.id, merchantId);
  }
}
