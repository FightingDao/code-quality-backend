import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../common/prisma.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';

@Injectable()
export class BugAnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  private resolvePeriod(dto: PeriodQueryDto) {
    const periodType = dto.periodType || 'week';
    const periodValue = dto.periodValue || this.getCurrentPeriodValue(periodType);
    return { periodType, periodValue };
  }

  private getCurrentPeriodValue(periodType: string): string {
    const now = new Date();
    if (periodType === 'month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      return `${y}${m}`;
    }
    const day = now.getDay();
    const back = (day + 7 - 4) % 7;
    const thu = new Date(now);
    thu.setDate(now.getDate() - back);
    return thu.toISOString().slice(0, 10).replace(/-/g, '');
  }

  async getOverview(dto: PeriodQueryDto) {
    const { periodType, periodValue } = this.resolvePeriod(dto);

    const [report, totalBugs, severityRows, phaseRows, typeRows, fixerRows] = await Promise.all([
      this.prisma.bugAnalysisReport.findUnique({
        where: { periodType_periodValue: { periodType, periodValue } },
      }),
      this.prisma.bugItem.count({ where: { periodType, periodValue } }),
      this.prisma.$queryRaw<{ severity: string; cnt: bigint }[]>`
        SELECT COALESCE(NULLIF(severity, ''), '未知') as severity, COUNT(*) as cnt
        FROM bug_items
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
        GROUP BY COALESCE(NULLIF(severity, ''), '未知')
        ORDER BY cnt DESC
      `,
      this.prisma.$queryRaw<{ phase: string; cnt: bigint }[]>`
        SELECT COALESCE(NULLIF(bug_found_phase, ''), '未知') as phase, COUNT(*) as cnt
        FROM bug_items
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
        GROUP BY COALESCE(NULLIF(bug_found_phase, ''), '未知')
        ORDER BY cnt DESC
      `,
      this.prisma.$queryRaw<{ type: string; cnt: bigint }[]>`
        SELECT t.type, COUNT(*) as cnt
        FROM bug_items bi,
             jsonb_array_elements_text(COALESCE(bi.bug_type_new, '[]'::jsonb)) AS t(type)
        WHERE bi.period_type = ${periodType} AND bi.period_value = ${periodValue}
        GROUP BY t.type
        ORDER BY cnt DESC
      `,
      this.prisma.$queryRaw<{ cnt: bigint }[]>`
        SELECT COUNT(DISTINCT fix_person) as cnt
        FROM bug_items
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
          AND fix_person IS NOT NULL AND fix_person != ''
      `,
    ]);

    const passedBugs = await this.prisma.bugItem.count({
      where: { periodType, periodValue, bugStatus: { contains: '验证通过' } },
    });

    const criticalAndSevere = severityRows
      .filter(r => r.severity === '致命' || r.severity === '严重')
      .reduce((s, r) => s + Number(r.cnt), 0);

    return {
      success: true,
      data: {
        periodType,
        periodValue,
        kpi: {
          totalBugs,
          passedBugs,
          passRate: totalBugs > 0 ? +((passedBugs / totalBugs) * 100).toFixed(1) : 0,
          criticalAndSevere,
          criticalRate: totalBugs > 0 ? +((criticalAndSevere / totalBugs) * 100).toFixed(1) : 0,
          fixerCount: Number(fixerRows[0]?.cnt ?? 0),
        },
        severityDistribution: severityRows.map(r => ({
          severity: r.severity || '未知',
          count: Number(r.cnt),
        })),
        phaseDistribution: phaseRows.map(r => ({
          phase: r.phase || '未知',
          count: Number(r.cnt),
        })),
        typeDistribution: typeRows.map(r => ({
          type: r.type || '未分类',
          count: Number(r.cnt),
        })),
        trendSummary: report?.trendSummary || null,
      },
    };
  }

  async getByPerson(dto: PeriodQueryDto) {
    const { periodType, periodValue } = this.resolvePeriod(dto);

    const stats = await this.prisma.bugStatistic.findMany({
      where: { periodType, periodValue },
      orderBy: { totalBugs: 'desc' },
    });

    return {
      success: true,
      data: stats.map(s => ({
        username: s.username,
        totalBugs: s.totalBugs,
        criticalBugs: s.criticalBugs,
        severeBugs: s.severeBugs,
        normalBugs: s.normalBugs,
        minorBugs: s.minorBugs,
        avgFixTimes: s.avgFixTimes ? Number(s.avgFixTimes) : 0,
        avgHandOffsTimes: s.avgHandOffsTimes ? Number(s.avgHandOffsTimes) : 0,
        bugTypeDistribution: s.bugTypeDistribution,
        phaseDistribution: s.phaseDistribution,
      })),
    };
  }

  async getTrend(dto: PeriodQueryDto & { limit?: number }) {
    const periodType = dto.periodType || 'week';
    const limit = Math.min(Number(dto.limit) || 8, 24);

    const reports = await this.prisma.bugAnalysisReport.findMany({
      where: { periodType },
      orderBy: { periodValue: 'desc' },
      take: limit,
      select: {
        periodValue: true,
        totalBugs: true,
        severityDistribution: true,
      },
    });

    return {
      success: true,
      data: reports.reverse().map(r => {
        const dist = (r.severityDistribution as Record<string, number>) || {};
        return {
          periodValue: r.periodValue,
          totalBugs: r.totalBugs,
          criticalAndSevere: (dist['致命'] || 0) + (dist['严重'] || 0),
          normal: dist['一般'] || 0,
          minor: dist['轻微'] || 0,
        };
      }),
    };
  }

  async getInsights(dto: PeriodQueryDto) {
    const { periodType, periodValue } = this.resolvePeriod(dto);

    const report = await this.prisma.bugAnalysisReport.findUnique({
      where: { periodType_periodValue: { periodType, periodValue } },
    });

    if (!report) {
      return { success: true, data: { hasData: false, periodType, periodValue } };
    }

    return {
      success: true,
      data: {
        hasData: true,
        periodType,
        periodValue,
        trendSummary: report.trendSummary,
        topIssueTypes: report.topIssueTypes,
        highRiskPersons: report.highRiskPersons,
        phaseAnalysis: report.phaseAnalysis,
        aiInsights: report.aiInsights,
        aiSuggestions: report.aiSuggestions,
      },
    };
  }

  async getList(
    dto: PeriodQueryDto & {
      page?: number;
      limit?: number;
      severity?: string;
      fixPerson?: string;
      bugStatus?: string;
    },
  ) {
    const { periodType, periodValue } = this.resolvePeriod(dto);
    const page = Math.max(Number(dto.page) || 1, 1);
    const limit = Math.min(Number(dto.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { periodType, periodValue };
    if (dto.severity) where.severity = dto.severity;
    if (dto.fixPerson) where.fixPerson = { contains: dto.fixPerson };
    if (dto.bugStatus) where.bugStatus = { contains: dto.bugStatus };

    const [total, items] = await Promise.all([
      this.prisma.bugItem.count({ where }),
      this.prisma.bugItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ severity: 'asc' }, { dateCreated: 'desc' }],
        select: {
          id: true,
          bugNo: true,
          bugName: true,
          severity: true,
          bugStatus: true,
          bugFoundPhase: true,
          bugTypeNew: true,
          subsystem: true,
          sprintName: true,
          fixPerson: true,
          reporter: true,
          dateCreated: true,
          fixTimes: true,
          handOffsTimes: true,
          committerName: true,
          projectName: true,
        },
      }),
    ]);

    return {
      success: true,
      data: items,
      meta: { total, page, limit },
    };
  }

  async getDetail(bugNo: string) {
    const bug = await this.prisma.bugItem.findUnique({ where: { bugNo } });
    if (!bug) {
      return { success: false, message: '未找到该 Bug' };
    }
    return { success: true, data: bug };
  }

  async getCodeChanges(bugNo: string) {
    // 1. 从 bug_items 获取关联的 commit
    const bugItem = await this.prisma.bugItem.findUnique({
      where: { bugNo },
      select: { commitHash: true, projectName: true },
    });

    // 2. 从 code_reviews 搜索 commit 消息包含该 bugNo 的记录
    const relatedReviews = await this.prisma.codeReview.findMany({
      where: { commitMessage: { contains: bugNo } },
      select: {
        commitHash: true,
        commitMessage: true,
        committerName: true,
        commitDate: true,
        commitBranch: true,
        analysis: { select: { project: { select: { name: true, repository: true } } } },
      },
      take: 20,
    });

    // 3. 合并 commit hash 列表（去重）
    const hashSet = new Set<string>();
    if (bugItem?.commitHash) hashSet.add(bugItem.commitHash);
    for (const r of relatedReviews) hashSet.add(r.commitHash);

    if (hashSet.size === 0) {
      return { success: true, data: [] };
    }

    // 4. 尝试从 config.json 读取 codebaseDir
    const configPaths = [
      path.join(__dirname, '../../../../../config.json'),
      path.join(process.env.HOME || '', '.openclaw/workspace/code-claw-config.json'),
    ];
    let codebaseDir = '';
    for (const p of configPaths) {
      if (fs.existsSync(p)) {
        try {
          const cfg = JSON.parse(fs.readFileSync(p, 'utf-8'));
          codebaseDir = cfg.codebaseDir || '';
          break;
        } catch { /* ignore */ }
      }
    }

    // 5. 针对每个 commit hash，尝试在对应仓库中执行 git show
    const changes: {
      commitHash: string;
      commitMessage: string;
      committerName: string;
      commitDate: string | null;
      projectName: string;
      diff: string;
    }[] = [];

    const reviewMap = new Map(relatedReviews.map(r => [r.commitHash, r]));

    for (const hash of hashSet) {
      const review = reviewMap.get(hash);
      const projectName = review?.analysis?.project?.name
        || review?.analysis?.project?.repository
        || bugItem?.projectName
        || '';
      const repoName = projectName.split('/').pop() || projectName;

      let diff = '';
      // 尝试在 codebaseDir 下各子目录中找到含该 commit 的仓库
      if (codebaseDir && fs.existsSync(codebaseDir)) {
        const repoDirs = [
          path.join(codebaseDir, repoName),
          ...fs.readdirSync(codebaseDir)
            .map(d => path.join(codebaseDir, d))
            .filter(d => fs.statSync(d).isDirectory()),
        ];
        for (const repoDir of repoDirs) {
          try {
            diff = execSync(
              `git show ${hash} --stat --patch --no-color`,
              { cwd: repoDir, timeout: 5000, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
            );
            if (diff) break;
          } catch { /* try next */ }
        }
      }

      changes.push({
        commitHash: hash,
        commitMessage: review?.commitMessage || '',
        committerName: review?.committerName || bugItem?.projectName || '',
        commitDate: review?.commitDate ? review.commitDate.toISOString() : null,
        projectName,
        diff,
      });
    }

    return { success: true, data: changes };
  }

  async getPeriods(periodType?: string) {
    const where = periodType ? { periodType } : {};
    const rows = await this.prisma.bugAnalysisReport.findMany({
      where,
      orderBy: { periodValue: 'desc' },
      select: { periodType: true, periodValue: true, totalBugs: true },
      take: 24,
    });
    return { success: true, data: rows };
  }
}
