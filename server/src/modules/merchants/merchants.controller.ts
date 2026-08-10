import { Controller, Get, Post, Body, Query, Param, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger'
import { MerchantsService } from './merchants.service'
import { QueryMerchantsDto } from './dto/query-merchants.dto'
import { QueryScoresDto } from './dto/query-scores.dto'

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  @ApiOperation({ summary: '获取商家列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'zawerMin', required: false, type: Number })
  @ApiQuery({ name: 'zawerMax', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'distance', required: false, type: Number })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getList(@Query() query: QueryMerchantsDto) {
    return this.merchantsService.getList(query)
  }

  @Get('search')
  @ApiOperation({ summary: '搜索商家' })
  @ApiQuery({ name: 'keyword', required: true, type: String })
  async search(@Query('keyword') keyword: string) {
    return this.merchantsService.search(keyword)
  }

  @Post('scores')
  @ApiOperation({ summary: '按高德 POI ID 批量查询 Zawer 评分' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getScores(@Body() dto: QueryScoresDto) {
    return this.merchantsService.getScoresByPoiIds(dto.poiIds)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商家详情' })
  @ApiParam({ name: 'id', type: String })
  async getById(@Param('id') id: string) {
    return this.merchantsService.getById(id)
  }
}
