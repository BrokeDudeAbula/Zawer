import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { VotesService } from './votes.service'
import { ToggleVoteDto } from './dto/toggle-vote.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点 Zawer / 取消（同一用户对同一商家只计一次）' })
  async toggle(@Request() req, @Body() dto: ToggleVoteDto) {
    return this.votesService.toggle(req.user.id, dto)
  }

  @Get('merchant/:merchantId/comments')
  @ApiOperation({ summary: '获取商家的吐槽列表' })
  @ApiParam({ name: 'merchantId' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getComments(
    @Param('merchantId') merchantId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.votesService.getComments(
      merchantId,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 10,
    )
  }

  @Get('merchant/:merchantId/voted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查询当前用户是否已对该商家投票' })
  @ApiParam({ name: 'merchantId' })
  async hasVoted(@Request() req, @Param('merchantId') merchantId: string) {
    return this.votesService.hasVoted(req.user.id, merchantId)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '我点过 Zawer 的商家' })
  async getMyVotes(@Request() req) {
    return this.votesService.getUserVotes(req.user.id)
  }
}
