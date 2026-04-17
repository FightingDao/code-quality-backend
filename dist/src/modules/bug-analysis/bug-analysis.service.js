"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma_service_1 = require("../../common/prisma.service");
let BugAnalysisService = class BugAnalysisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    resolvePeriod(dto) {
        const periodType = dto.periodType || 'week';
        const periodValue = dto.periodValue || this.getCurrentPeriodValue(periodType);
        return { periodType, periodValue };
    }
    getCurrentPeriodValue(periodType) {
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
    async getOverview(dto) {
        const { periodType, periodValue } = this.resolvePeriod(dto);
        const [report, totalBugs, severityRows, phaseRows, typeRows, fixerRows] = await Promise.all([
            this.prisma.bugAnalysisReport.findUnique({
                where: { periodType_periodValue: { periodType, periodValue } },
            }),
            this.prisma.bugItem.count({ where: { periodType, periodValue } }),
            this.prisma.$queryRaw `
        SELECT COALESCE(NULLIF(severity, ''), '未知') as severity, COUNT(*) as cnt
        FROM bug_items
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
        GROUP BY COALESCE(NULLIF(severity, ''), '未知')
        ORDER BY cnt DESC
      `,
            this.prisma.$queryRaw `
        SELECT COALESCE(NULLIF(bug_found_phase, ''), '未知') as phase, COUNT(*) as cnt
        FROM bug_items
        WHERE period_type = ${periodType} AND period_value = ${periodValue}
        GROUP BY COALESCE(NULLIF(bug_found_phase, ''), '未知')
        ORDER BY cnt DESC
      `,
            this.prisma.$queryRaw `
        SELECT t.type, COUNT(*) as cnt
        FROM bug_items bi,
             jsonb_array_elements_text(COALESCE(bi.bug_type_new, '[]'::jsonb)) AS t(type)
        WHERE bi.period_type = ${periodType} AND bi.period_value = ${periodValue}
        GROUP BY t.type
        ORDER BY cnt DESC
      `,
            this.prisma.$queryRaw `
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
    async getByPerson(dto) {
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
    async getTrend(dto) {
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
                const dist = r.severityDistribution || {};
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
    async getInsights(dto) {
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
    async getList(dto) {
        const { periodType, periodValue } = this.resolvePeriod(dto);
        const page = Math.max(Number(dto.page) || 1, 1);
        const limit = Math.min(Number(dto.limit) || 20, 100);
        const skip = (page - 1) * limit;
        const where = { periodType, periodValue };
        if (dto.severity)
            where.severity = dto.severity;
        if (dto.fixPerson)
            where.fixPerson = { contains: dto.fixPerson };
        if (dto.bugStatus)
            where.bugStatus = { contains: dto.bugStatus };
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
    async getDetail(bugNo) {
        const bug = await this.prisma.bugItem.findUnique({ where: { bugNo } });
        if (!bug) {
            return { success: false, message: '未找到该 Bug' };
        }
        return { success: true, data: bug };
    }
    async getCodeChanges(bugNo) {
        const bugItem = await this.prisma.bugItem.findUnique({
            where: { bugNo },
            select: { commitHash: true, projectName: true },
        });
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
        const hashSet = new Set();
        if (bugItem?.commitHash)
            hashSet.add(bugItem.commitHash);
        for (const r of relatedReviews)
            hashSet.add(r.commitHash);
        if (hashSet.size === 0) {
            return { success: true, data: [] };
        }
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
                }
                catch { }
            }
        }
        const changes = [];
        const reviewMap = new Map(relatedReviews.map(r => [r.commitHash, r]));
        for (const hash of hashSet) {
            const review = reviewMap.get(hash);
            const projectName = review?.analysis?.project?.name
                || review?.analysis?.project?.repository
                || bugItem?.projectName
                || '';
            const repoName = projectName.split('/').pop() || projectName;
            let diff = '';
            if (codebaseDir && fs.existsSync(codebaseDir)) {
                const repoDirs = [
                    path.join(codebaseDir, repoName),
                    ...fs.readdirSync(codebaseDir)
                        .map(d => path.join(codebaseDir, d))
                        .filter(d => fs.statSync(d).isDirectory()),
                ];
                for (const repoDir of repoDirs) {
                    try {
                        diff = (0, child_process_1.execSync)(`git show ${hash} --stat --patch --no-color`, { cwd: repoDir, timeout: 5000, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
                        if (diff)
                            break;
                    }
                    catch { }
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
    async getPeriods(periodType) {
        const where = periodType ? { periodType } : {};
        const rows = await this.prisma.bugAnalysisReport.findMany({
            where,
            orderBy: { periodValue: 'desc' },
            select: { periodType: true, periodValue: true, totalBugs: true },
            take: 24,
        });
        return { success: true, data: rows };
    }
};
exports.BugAnalysisService = BugAnalysisService;
exports.BugAnalysisService = BugAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BugAnalysisService);
//# sourceMappingURL=bug-analysis.service.js.map