import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';

@ApiTags('任务大盘')
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('overview')
  @ApiOperation({ summary: '任务难度 KPI 概览（高/中/低数量 + 均分）' })
  async getOverview(@Query() dto: PeriodQueryDto) {
    return this.tasksService.getOverview(dto);
  }

  @Get('distribution')
  @ApiOperation({ summary: '难度分布饼图 + 各维度均值雷达图' })
  async getDistribution(@Query() dto: PeriodQueryDto) {
    return this.tasksService.getDistribution(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '任务列表（含5维评分，支持难度筛选分页）' })
  async getList(
    @Query() dto: PeriodQueryDto & { difficulty?: string; page?: number; limit?: number },
  ) {
    return this.tasksService.getList(dto);
  }

  @Get('periods')
  @ApiOperation({ summary: '已有数据的周期列表' })
  async getPeriods(@Query('periodType') periodType?: string) {
    return this.tasksService.getPeriods(periodType);
  }
}
