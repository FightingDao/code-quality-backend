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
exports.DataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let DataService = class DataService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async batchCreateAnalyses(dto) {
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
    async batchSyncUsers(dto) {
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
            }
            else {
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
    async calculateStatistics(dto) {
        if (dto.projectId) {
            await this.calculateProjectStatistics(dto.periodType, dto.periodValue, dto.projectId);
        }
        else {
            const projects = await this.prisma.project.findMany();
            for (const project of projects) {
                await this.calculateProjectStatistics(dto.periodType, dto.periodValue, project.id);
            }
        }
        if (dto.teamId) {
            await this.calculateTeamStatistics(dto.periodType, dto.periodValue, dto.teamId);
        }
        else {
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
    async calculateProjectStatistics(periodType, periodValue, projectId) {
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
            avgQualityScore: this.calculateAverageScore(analyses.map((a) => a.aiQualityScore).filter(Boolean)),
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
    async calculateTeamStatistics(periodType, periodValue, teamId) {
        const users = await this.prisma.user.findMany({
            where: { teamId },
        });
        if (users.length === 0) {
            return;
        }
        const userIds = users.map((u) => u.id);
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
            avgQualityScore: this.calculateAverageScore(analyses.map((a) => a.aiQualityScore).filter(Boolean)),
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
    calculateAverageScore(scores) {
        if (scores.length === 0) {
            return null;
        }
        const sum = scores.reduce((acc, score) => acc + Number(score), 0);
        return Math.round((sum / scores.length) * 100) / 100;
    }
};
exports.DataService = DataService;
exports.DataService = DataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DataService);
//# sourceMappingURL=data.service.js.map