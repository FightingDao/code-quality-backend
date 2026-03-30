"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProjectList(dto) {
        const page = dto.page || 1;
        const limit = dto.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (dto.teamId) {
            where.teamId = dto.teamId;
        }
        if (dto.isActive !== undefined) {
            where.isActive = dto.isActive;
        }
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                skip,
                take: limit,
                include: {
                    team: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.project.count({ where }),
        ]);
        const items = projects.map((project) => ({
            id: project.id,
            name: project.name,
            repository: project.repository,
            description: project.description,
            teamId: project.teamId,
            teamName: project.team?.name,
            techStack: project.techStack,
            isActive: project.isActive,
            defaultBranch: project.defaultBranch,
            lastCommitAt: project.lastCommitAt,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));
        return {
            success: true,
            data: items,
            meta: {
                total,
                page,
                limit,
                hasMore: total > page * limit,
            },
        };
    }
    async resolveProjectId(idOrName) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(idOrName)) {
            const project = await this.prisma.project.findUnique({
                where: { id: idOrName },
                include: { team: true },
            });
            return project ? { id: project.id, project } : null;
        }
        const projectById = await this.prisma.project.findUnique({
            where: { id: idOrName },
            include: { team: true },
        });
        if (projectById) {
            return { id: projectById.id, project: projectById };
        }
        const projectByName = await this.prisma.project.findFirst({
            where: { name: idOrName },
            include: { team: true },
        });
        return projectByName ? { id: projectByName.id, project: projectByName } : null;
    }
    async getProjectInfo(idOrName) {
        const result = await this.resolveProjectId(idOrName);
        if (!result) {
            throw new common_1.NotFoundException(`项目不存在: ${idOrName}`);
        }
        const project = result.project;
        return {
            success: true,
            data: {
                id: project.id,
                name: project.name,
                repository: project.repository,
                description: project.description,
                teamId: project.teamId,
                teamName: project.team?.name,
                techStack: project.techStack,
                isActive: project.isActive,
                defaultBranch: project.defaultBranch,
                lastCommitAt: project.lastCommitAt,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        };
    }
    async getProjectReport(idOrName, dto) {
        const result = await this.resolveProjectId(idOrName);
        if (!result) {
            throw new common_1.NotFoundException(`项目不存在: ${idOrName}`);
        }
        const project = result.project;
        const id = project.id;
        const periodType = dto.periodType || 'week';
        const periodValue = dto.periodValue || this.getDefaultPeriodValue(periodType);
        const statistic = await this.prisma.projectStatistic.findUnique({
            where: {
                projectId_periodType_periodValue: {
                    projectId: id,
                    periodType,
                    periodValue,
                },
            },
        });
        const memberAnalyses = await this.prisma.codeAnalysis.findMany({
            where: {
                projectId: id,
                periodType,
                periodValue,
            },
            include: {
                user: true,
            },
            orderBy: { commitCount: 'desc' }
        });
        const totalCommits = memberAnalyses.reduce((sum, a) => sum + a.commitCount, 0);
        const totalIssues = await this.prisma.$queryRaw `
      SELECT COUNT(*) as count
      FROM code_issues ci
      JOIN code_analyses ca ON ci.analysis_id = ca.id
      WHERE ca.project_id = ${id}
        AND ca.period_type = ${periodType}
        AND ca.period_value = ${periodValue}
    `;
        const totalIssueCount = Number(totalIssues[0]?.count || 0);
        const memberIssues = await this.prisma.$queryRaw `
      SELECT 
        ca.user_id,
        ci.severity,
        COUNT(*) as count
      FROM code_issues ci
      JOIN code_analyses ca ON ci.analysis_id = ca.id
      WHERE ca.project_id = ${id}
        AND ca.period_type = ${periodType}
        AND ca.period_value = ${periodValue}
      GROUP BY ca.user_id, ci.severity
    `;
        const memberIssueMap = new Map();
        memberIssues.forEach((item) => {
            const userId = item.user_id;
            if (!memberIssueMap.has(userId)) {
                memberIssueMap.set(userId, { p0: 0, p1: 0, p2: 0, total: 0 });
            }
            const stats = memberIssueMap.get(userId);
            stats.total += Number(item.count);
            if (item.severity === 'P0')
                stats.p0 += Number(item.count);
            else if (item.severity === 'P1')
                stats.p1 += Number(item.count);
            else if (item.severity === 'P2')
                stats.p2 += Number(item.count);
        });
        const members = memberAnalyses.map(a => {
            const issueStats = memberIssueMap.get(a.userId) || { p0: 0, p1: 0, p2: 0, total: 0 };
            const mustFixCount = issueStats.p0 + issueStats.p1;
            const suggestCount = issueStats.p2;
            const commitRatio = totalCommits > 0 ? (a.commitCount / totalCommits * 100).toFixed(1) : '0.0';
            const issueRatio = totalIssueCount > 0 ? (issueStats.total / totalIssueCount * 100).toFixed(1) : '0.0';
            let qualityRating = '优';
            if (issueStats.total === 0) {
                qualityRating = '优';
            }
            else if (mustFixCount >= 3 || issueStats.total >= 5) {
                qualityRating = '需重点关注';
            }
            else if (mustFixCount >= 1 || issueStats.total >= 3) {
                qualityRating = '待改进';
            }
            else {
                qualityRating = '良好';
            }
            return {
                id: a.userId,
                username: a.user.username,
                commitCount: a.commitCount,
                commitRatio: `${commitRatio}%`,
                insertions: a.insertions,
                deletions: a.deletions,
                netLines: a.insertions - a.deletions,
                mustFixCount,
                suggestCount,
                issueCount: issueStats.total,
                issueRatio: `${issueRatio}%`,
                qualityRating,
                fileChanges: a.fileChanges || [],
                aiQualityScore: a.aiQualityScore,
                aiQualityReport: a.aiQualityReport
            };
        });
        const avgScore = statistic?.avgQualityScore ? Number(statistic.avgQualityScore) :
            (memberAnalyses.length > 0 ?
                memberAnalyses.filter(a => a.aiQualityScore).reduce((sum, a) => sum + Number(a.aiQualityScore), 0) /
                    Math.max(memberAnalyses.filter(a => a.aiQualityScore).length, 1) : null);
        const totalTasks = statistic?.totalTasks || memberAnalyses.reduce((sum, a) => sum + (a.taskCount || 0), 0);
        const report = {
            id: project.id,
            name: project.name,
            repository: project.repository,
            description: project.description,
            teamId: project.teamId,
            teamName: project.team?.name,
            techStack: project.techStack,
            isActive: project.isActive,
            defaultBranch: project.defaultBranch,
            lastCommitAt: project.lastCommitAt,
            periodType,
            periodValue,
            totalContributors: statistic?.totalContributors || memberAnalyses.length,
            totalCommits,
            totalInsertions: statistic?.totalInsertions || memberAnalyses.reduce((sum, a) => sum + a.insertions, 0),
            totalDeletions: statistic?.totalDeletions || memberAnalyses.reduce((sum, a) => sum + a.deletions, 0),
            totalTasks,
            totalLines: statistic?.totalLines || memberAnalyses.reduce((sum, a) => sum + a.totalLines, 0),
            avgQualityScore: avgScore,
            aiRating: statistic?.aiRating || (avgScore && avgScore >= 8 ? '优秀' : avgScore && avgScore >= 7 ? '良好' : '一般'),
            aiAdvantages: statistic?.aiAdvantages || [
                '项目代码结构清晰',
                `本周共完成 ${totalCommits} 次提交`,
                `${memberAnalyses.length} 位成员参与开发`
            ],
            aiSuggestions: statistic?.aiSuggestions || [
                '建议完善单元测试覆盖率',
                '持续优化代码结构',
                '加强代码审查流程'
            ],
            aiCommonIssues: statistic?.aiCommonIssues || [
                '部分代码缺少注释',
                '建议统一代码风格'
            ],
            aiBestPractices: statistic?.aiBestPractices || [
                '保持良好的提交习惯',
                '遵循团队代码规范'
            ],
            currentVersion: memberAnalyses[0]?.currentVersion || '',
            compareVersion: memberAnalyses[0]?.compareVersion || '',
            reportGeneratedAt: memberAnalyses[0]?.createdAt || statistic?.createdAt || new Date(),
            members
        };
        return {
            success: true,
            data: report,
        };
    }
    getDefaultPeriodValue(periodType) {
        const now = new Date();
        if (periodType === 'week') {
            const dayOfWeek = now.getDay();
            const daysToThursday = (4 - dayOfWeek + 7) % 7;
            const thursday = new Date(now);
            thursday.setDate(now.getDate() + daysToThursday);
            const year = thursday.getFullYear();
            const month = String(thursday.getMonth() + 1).padStart(2, '0');
            const day = String(thursday.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        }
        else if (periodType === 'quarter') {
            const year = now.getFullYear();
            const month = now.getMonth();
            const quarter = Math.floor(month / 3) + 1;
            return `${year}-Q${quarter}`;
        }
        else {
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            return `${year}${month}`;
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map