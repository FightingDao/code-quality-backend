import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsObject, Min } from 'class-validator';

export class CreateCodeAnalysisDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '项目ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: '周期类型', enum: ['week', 'month'] })
  @IsEnum(['week', 'month'])
  periodType: 'week' | 'month';

  @ApiProperty({ description: '周期值，周维度为YYYYMMDD，月维度为YYYYMM' })
  @IsString()
  periodValue: string;

  @ApiProperty({ description: '提交次数' })
  @IsNumber()
  @Min(0)
  commitCount: number;

  @ApiProperty({ description: '新增行数' })
  @IsNumber()
  @Min(0)
  insertions: number;

  @ApiProperty({ description: '删除行数' })
  @IsNumber()
  @Min(0)
  deletions: number;

  @ApiProperty({ description: '变更文件数' })
  @IsNumber()
  @Min(0)
  filesChanged: number;

  @ApiProperty({ description: '总行数' })
  @IsNumber()
  @Min(0)
  totalLines: number;

  @ApiProperty({ description: '代码行数' })
  @IsNumber()
  @Min(0)
  codeLines: number;

  @ApiProperty({ description: '注释行数' })
  @IsNumber()
  @Min(0)
  commentLines: number;

  @ApiProperty({ description: '空白行数' })
  @IsNumber()
  @Min(0)
  blankLines: number;

  @ApiProperty({ description: '语言分布', required: false })
  @IsOptional()
  @IsObject()
  languages?: Record<string, number>;

  @ApiProperty({ description: '文件变更明细', required: false })
  @IsOptional()
  @IsObject()
  fileChanges?: any[];

  @ApiProperty({ description: 'AI质量评分（0-10分）', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  aiQualityScore?: number;

  @ApiProperty({ description: 'AI质量报告（Markdown格式）', required: false })
  @IsOptional()
  @IsString()
  aiQualityReport?: string;

  @ApiProperty({ description: '任务数量', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taskCount?: number;
}

export class BatchCreateCodeAnalysisDto {
  @ApiProperty({ description: '代码分析数据数组', type: [CreateCodeAnalysisDto] })
  analyses: CreateCodeAnalysisDto[];
}

export class SyncUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  username: string;

  @ApiProperty({ description: '邮箱' })
  @IsString()
  email: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '小组ID', required: false })
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiProperty({ description: 'Git用户名', required: false })
  @IsOptional()
  @IsString()
  gitUsername?: string;

  @ApiProperty({ description: 'Git邮箱', required: false })
  @IsOptional()
  @IsString()
  gitEmail?: string;
}

export class BatchSyncUsersDto {
  @ApiProperty({ description: '用户数据数组', type: [SyncUserDto] })
  users: SyncUserDto[];
}

export class CalculateStatisticsDto {
  @ApiProperty({ description: '周期类型', enum: ['week', 'month'] })
  @IsEnum(['week', 'month'])
  periodType: 'week' | 'month';

  @ApiProperty({ description: '周期值' })
  @IsString()
  periodValue: string;

  @ApiProperty({ description: '小组ID（可选，不传则计算所有小组）', required: false })
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiProperty({ description: '项目ID（可选，不传则计算所有项目）', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}