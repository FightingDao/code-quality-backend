import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  BatchCreateCodeAnalysisDto,
  BatchSyncUsersDto,
  CalculateStatisticsDto,
} from './dto/data.dto';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  /**
   * 批量写入代码分析数据
   */
  async batchCreateAnalyses(dto: BatchCreateCodeAnalysisDto) {
    const results = await this.prisma.codeAnalysis.createMany({
      data: dto.analyses,
      skipDuplicates: true,
    });

    return {
      success: true,
      data: {
        count: results.count,
        message: `成功创建 ${results.count} 条代码分析数据`,
      },
    };
  }

  /**
   * 批量同步用户信息
   */
  async batchSyncUsers(dto: BatchSyncUsersDto) {
    let created = 0;
    let updated = 0;

    for (const user of dto.users) {
      const existing = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existing) {
        await this.prisma.user.update({
          where: { email: user.email },
          data: user,
        });
        updated++;
      } else {
        await this.prisma.user.create({
          data: user,
        });
        created++;
      }
    }

    return {
      success: true,
      data: {
        created,
        updated,
        total: created + updated,
        message: `成功创建 ${created} 个用户，更新 ${updated} 个用户`,
      },
    };
  }

  /**
   * 计算统计数据
   */
  async calculateStatistics(dto: CalculateStatisticsDto) {
    // 计算小组统计
    if (dto.projectId) {
      await this.calculateProjectStatistics(dto.periodType, dto.periodValue, dto.projectId);
    } else {
      // 计算所有项目统计
      const projects = await this.prisma.project.findMany();
      for (const project of projects) {
        await this.calculateProjectStatistics(dto.periodType, dto.periodValue, project.id);
      }
    }

    // 计算小组统计
    if (dto.teamId) {
      await this.calculateTeamStatistics(dto.periodType, dto.periodValue, dto.teamId);
    } else {
      // 计算所有小组统计
      const teams = await this.prisma.team.findMany();
      for (const team of teams) {
        await this.calculateTeamStatistics(dto.periodType, dto.periodValue, team.id);
      }
    }

    return {
      success: true,
      data: {
        message: '统计数据计算完成',
      },
    };
  }

  /**
   * 计算项目统计
   */
  private async calculateProjectStatistics(
    periodType: string,
    periodValue: string,
    projectId: string,
  ) {
    const analyses = await this.prisma.codeAnalysis.findMany({
      where: {
        projectId,
        periodType,
        periodValue,
      },
    });

    if (analyses.length === 0) {
      return;
    }

    const stats = {
      projectId,
      periodType,
      periodValue,
      totalContributors: new Set(analyses.map((a) => a.userId)).size,
      totalCommits: analyses.reduce((sum, a) => sum + a.commitCount, 0),
      totalInsertions: analyses.reduce((sum, a) => sum + a.insertions, 0),
      totalDeletions: analyses.reduce((sum, a) => sum + a.deletions, 0),
      totalTasks: analyses.reduce((sum, a) => sum + (a.taskCount || 0), 0),
      totalLines: analyses.reduce((sum, a) => sum + a.totalLines, 0),
      avgQualityScore: this.calculateAverageScore(
        analyses.map((a) => a.aiQualityScore).filter(Boolean) as any[],
      ),
    };

    await this.prisma.projectStatistic.upsert({
      where: {
        projectId_periodType_periodValue: {
          projectId,
          periodType,
          periodValue,
        },
      },
      update: stats,
      create: stats,
    });
  }

  /**
   * 计算小组统计
   */
  private async calculateTeamStatistics(
    periodType: string,
    periodValue: string,
    teamId: string,
  ) {
    // 获取小组成员
    const users = await this.prisma.user.findMany({
      where: { teamId },
    });

    if (users.length === 0) {
      return;
    }

    const userIds = users.map((u) => u.id);

    // 获取小组成员的代码分析数据
    const analyses = await this.prisma.codeAnalysis.findMany({
      where: {
        userId: { in: userIds },
        periodType,
        periodValue,
      },
    });

    const activeUserIds = new Set(analyses.map((a) => a.userId));

    const stats = {
      teamId,
      periodType,
      periodValue,
      totalMembers: users.length,
      activeMembers: activeUserIds.size,
      totalCommits: analyses.reduce((sum, a) => sum + a.commitCount, 0),
      totalInsertions: analyses.reduce((sum, a) => sum + a.insertions, 0),
      totalDeletions: analyses.reduce((sum, a) => sum + a.deletions, 0),
      totalTasks: analyses.reduce((sum, a) => sum + (a.taskCount || 0), 0),
      avgQualityScore: this.calculateAverageScore(
        analyses.map((a) => a.aiQualityScore).filter(Boolean) as any[],
      ),
    };

    await this.prisma.teamStatistic.upsert({
      where: {
        teamId_periodType_periodValue: {
          teamId,
          periodType,
          periodValue,
        },
      },
      update: stats,
      create: stats,
    });
  }

  /**
   * 计算平均分
   */
  private calculateAverageScore(scores: any[]): number | null {
    if (scores.length === 0) {
      return null;
    }
    const sum = scores.reduce((acc, score) => acc + Number(score), 0);
    return Math.round((sum / scores.length) * 100) / 100;
  }
}