import { Controller, Get, Query, Param, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { QueryMerchantsDto } from './dto/query-merchants.dto';

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
    return this.merchantsService.getList(query);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索商家' })
  @ApiQuery({ name: 'keyword', required: true, type: String })
  async search(@Query('keyword') keyword: string) {
    return this.merchantsService.search(keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商家详情' })
  @ApiParam({ name: 'id', type: String })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.merchantsService.getById(id);
  }
}
