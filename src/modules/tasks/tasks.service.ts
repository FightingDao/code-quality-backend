import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private resolvePeriod(dto: PeriodQueryDto) {
    const periodType = dto.periodType || 'week';
    const periodValue = dto.periodValue || this.getCurrentPeriodValue(periodType);
    return { periodType, periodValue };
  }

  private getCurrentPeriodValue(periodType: string): string {
    const now = new Date();
    if (periodType === 'month') {
      return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    const day = now.getDay();
    const back = (day + 7 - 4) % 7;
    const thu = new Date(now);
    thu.setDate(now.getDate() - back);
    return thu.toISOString().slice(0, 10).replace(/-/g, '');
  }

  async getOverview(dto: PeriodQueryDto) {
    const { periodType, periodValue } = this.resolvePeriod(dto);

    const [total, high, medium, low, avgRow] = await Promise.all([
      this.prisma.taskDifficultyScore.count({ where: { periodType, periodValue } }),
      this.prisma.taskDifficultyScore.count({ where: { periodType, periodValue, difficultyLevel: 'HIGH' } }),
      this.prisma.taskDifficultyScore.count({ where: { periodType, periodValue, difficultyLevel: 'MEDIUM' } }),
      this.prisma.taskDifficultyScore.count({ where: { periodType, periodValue, difficultyLevel: 'LOW' } }),
      this.prisma.$queryRaw<{ avg: number }[]>`
        SELECT ROUND(AVG(total_score)::numeric, 1) as avg
        FROM task_difficulty_scores
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
      `,
    ]);

    return {
      success: true,
      data: {
        periodType,
        periodValue,
        kpi: {
          total,
          high,
          medium,
          low,
          avgScore: Number(avgRow[0]?.avg ?? 0),
          highRate: total > 0 ? +((high / total) * 100).toFixed(1) : 0,
        },
      },
    };
  }

  async getDistribution(dto: PeriodQueryDto) {
    const { periodType, periodValue } = this.resolvePeriod(dto);

    const [diffDist, dimRow] = await Promise.all([
      this.prisma.$queryRaw<{ level: string; cnt: bigint }[]>`
        SELECT difficulty_level as level, COUNT(*) as cnt
        FROM task_difficulty_scores
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
        GROUP BY difficulty_level
      `,
      this.prisma.$queryRaw<{
        avgScale: number; avgComplexity: number; avgIssueDensity: number;
        avgAi: number; avgCrossModule: number;
      }[]>`
        SELECT
          ROUND(AVG(score_scale)::numeric, 1)         AS "avgScale",
          ROUND(AVG(score_complexity)::numeric, 1)    AS "avgComplexity",
          ROUND(AVG(score_issue_density)::numeric, 1) AS "avgIssueDensity",
          ROUND(AVG(score_ai)::numeric, 1)            AS "avgAi",
          ROUND(AVG(score_cross_module)::numeric, 1)  AS "avgCrossModule"
        FROM task_difficulty_scores
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
      `,
    ]);

    const dim = dimRow[0] ?? {};
    return {
      success: true,
      data: {
        difficultyDistribution: diffDist.map(r => ({
          level: r.level,
          count: Number(r.cnt),
        })),
        avgDimensions: [
          { dimension: '代码规模',   score: Number(dim.avgScale ?? 0) },
          { dimension: '代码复杂度', score: Number(dim.avgComplexity ?? 0) },
          { dimension: '缺陷密度',   score: Number(dim.avgIssueDensity ?? 0) },
          { dimension: 'AI质量反转', score: Number(dim.avgAi ?? 0) },
          { dimension: '跨模块影响', score: Number(dim.avgCrossModule ?? 0) },
        ],
      },
    };
  }

  async getList(dto: PeriodQueryDto & { difficulty?: string; page?: number; limit?: number }) {
    const { periodType, periodValue } = this.resolvePeriod(dto);
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(dto.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { periodType, periodValue };
    if (dto.difficulty) where.difficultyLevel = dto.difficulty;

    const [items, total] = await Promise.all([
      this.prisma.taskDifficultyScore.findMany({
        where,
        orderBy: { totalScore: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          taskNo: true,
          projectNames: true,
          committers: true,
          difficultyLevel: true,
          totalScore: true,
          scoreScale: true,
          scoreComplexity: true,
          scoreIssueDensity: true,
          scoreAi: true,
          scoreCrossModule: true,
          rawLoc: true,
          rawCommitCount: true,
          rawIssueCount: true,
          rawAvgAiScore: true,
          rawModuleCount: true,
        },
      }),
      this.prisma.taskDifficultyScore.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items: items.map(item => ({
          ...item,
          totalScore:       Number(item.totalScore),
          scoreScale:       Number(item.scoreScale),
          scoreComplexity:  Number(item.scoreComplexity),
          scoreIssueDensity: Number(item.scoreIssueDensity),
          scoreAi:          Number(item.scoreAi),
          scoreCrossModule: Number(item.scoreCrossModule),
          rawAvgAiScore:    item.rawAvgAiScore != null ? Number(item.rawAvgAiScore) : null,
        })),
        meta: { total, page, limit },
      },
    };
  }

  async getPeriods(periodType?: string) {
    const type = periodType || 'week';
    const rows = await this.prisma.taskDifficultyScore.findMany({
      where: { periodType: type },
      select: { periodValue: true },
      distinct: ['periodValue'],
      orderBy: { periodValue: 'desc' },
    });
    return { success: true, data: rows.map(r => r.periodValue) };
  }
}
