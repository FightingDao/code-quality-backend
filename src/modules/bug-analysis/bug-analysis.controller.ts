import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BugAnalysisService } from './bug-analysis.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';

@ApiTags('Bug 分析')
@Controller('api/v1/bugs')
export class BugAnalysisController {
  constructor(private readonly bugAnalysisService: BugAnalysisService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取 Bug 分析大盘概览（KPI + 分布统计）' })
  @ApiResponse({ status: 200 })
  async getOverview(@Query() dto: PeriodQueryDto) {
    return this.bugAnalysisService.getOverview(dto);
  }

  @Get('by-person')
  @ApiOperation({ summary: '按修复人统计 bug 数据' })
  @ApiResponse({ status: 200 })
  async getByPerson(@Query() dto: PeriodQueryDto) {
    return this.bugAnalysisService.getByPerson(dto);
  }

  @Get('trend')
  @ApiOperation({ summary: '跨周期缺陷趋势（最近 N 个周期）' })
  @ApiResponse({ status: 200 })
  async getTrend(@Query() dto: PeriodQueryDto & { limit?: number }) {
    return this.bugAnalysisService.getTrend(dto);
  }

  @Get('insights')
  @ApiOperation({ summary: '获取 AI 洞察报告' })
  @ApiResponse({ status: 200 })
  async getInsights(@Query() dto: PeriodQueryDto) {
    return this.bugAnalysisService.getInsights(dto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Bug 明细列表（支持筛选分页）' })
  @ApiResponse({ status: 200 })
  async getList(
    @Query() dto: PeriodQueryDto & {
      page?: number;
      limit?: number;
      severity?: string;
      fixPerson?: string;
      bugStatus?: string;
    },
  ) {
    return this.bugAnalysisService.getList(dto);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取单个 Bug 详情' })
  @ApiResponse({ status: 200 })
  async getDetail(@Query('bugNo') bugNo: string) {
    return this.bugAnalysisService.getDetail(bugNo);
  }

  @Get('code-changes')
  @ApiOperation({ summary: '获取 Bug 关联的代码变更（git diff）' })
  @ApiResponse({ status: 200 })
  async getCodeChanges(@Query('bugNo') bugNo: string) {
    return this.bugAnalysisService.getCodeChanges(bugNo);
  }

  @Get('periods')
  @ApiOperation({ summary: '获取已有数据的周期列表' })
  @ApiResponse({ status: 200 })
  async getPeriods(@Query('periodType') periodType?: string) {
    return this.bugAnalysisService.getPeriods(periodType);
  }
}
