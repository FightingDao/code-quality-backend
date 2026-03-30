import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataService } from './data.service';
import {
  BatchCreateCodeAnalysisDto,
  BatchSyncUsersDto,
  CalculateStatisticsDto,
} from './dto/data.dto';

@ApiTags('数据写入（小龙虾专用）')
@Controller('api/v1/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('analyses')
  @ApiOperation({ summary: '批量写入代码分析数据' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async batchCreateAnalyses(@Body() dto: BatchCreateCodeAnalysisDto) {
    return this.dataService.batchCreateAnalyses(dto);
  }

  @Post('sync-users')
  @ApiOperation({ summary: '批量同步用户信息' })
  @ApiResponse({ status: 201, description: '同步成功' })
  async batchSyncUsers(@Body() dto: BatchSyncUsersDto) {
    return this.dataService.batchSyncUsers(dto);
  }

  @Post('calculate-statistics')
  @ApiOperation({ summary: '触发统计计算' })
  @ApiResponse({ status: 201, description: '计算成功' })
  async calculateStatistics(@Body() dto: CalculateStatisticsDto) {
    return this.dataService.calculateStatistics(dto);
  }
}