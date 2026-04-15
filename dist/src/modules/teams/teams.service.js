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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const crypto_1 = require("crypto");
let TeamsService = class TeamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTeamList() {
        const teams = await this.prisma.team.findMany({
            include: {
                users: {
                    select: { id: true }
                },
                _count: {
                    select: { projects: true }
                }
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        const data = teams.map((team) => ({
            id: team.id,
            name: team.name,
            description: team.description,
            leaderName: team.leaderName,
            memberCount: team.users.length,
            projectCount: team._count.projects,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        }));
        return {
            success: true,
            data,
        };
    }
    async getUserNames() {
        const users = await this.prisma.user.findMany({
            where: {
                teamId: { not: null }
            },
            select: {
                username: true,
            },
            orderBy: {
                username: 'asc',
            },
        });
        return {
            success: true,
            data: users.map(u => u.username),
        };
    }
    async getAllActiveUsers() {
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            select: { id: true, username: true, email: true, gitUsername: true, gitEmail: true },
            orderBy: { username: 'asc' },
        });
        return { success: true, data: users };
    }
    async getTeamDetail(id) {
        return this.getTeamDetailWithTx(id, this.prisma);
    }
    async createTeam(dto) {
        const { name, description, leaderName, memberNames } = dto;
        const existingTeam = await this.prisma.team.findFirst({
            where: { name }
        });
        if (existingTeam) {
            throw new common_1.ConflictException('小组名称已存在');
        }
        const teamId = `team-${(0, crypto_1.randomUUID)().slice(0, 8)}`;
        return this.prisma.$transaction(async (tx) => {
            const team = await tx.team.create({
                data: {
                    id: teamId,
                    name: name,
                    description: description || null,
                    leaderName: leaderName || null,
                },
            });
            if (memberNames && memberNames.length > 0) {
                for (const username of memberNames) {
                    let user = await tx.user.findFirst({
                        where: { username }
                    });
                    if (!user) {
                        user = await tx.user.create({
                            data: {
                                id: `user-${(0, crypto_1.randomUUID)().slice(0, 8)}`,
                                username: username,
                                email: `${username}@internal.com`,
                            }
                        });
                    }
                    await tx.user.update({
                        where: { id: user.id },
                        data: { teamId: team.id }
                    });
                }
            }
            return this.getTeamDetailWithTx(team.id, tx);
        });
    }
    async updateTeam(teamId, dto) {
        const { name, description, leaderName, memberNames } = dto;
        const team = await this.prisma.team.findUnique({
            where: { id: teamId }
        });
        if (!team) {
            throw new common_1.NotFoundException('小组不存在');
        }
        if (name && name !== team.name) {
            const existingTeam = await this.prisma.team.findFirst({
                where: { name: name, id: { not: teamId } }
            });
            if (existingTeam) {
                throw new common_1.ConflictException('小组名称已存在');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.team.update({
                where: { id: teamId },
                data: {
                    name: name || undefined,
                    description: description,
                    leaderName: leaderName,
                },
            });
            if (memberNames !== undefined) {
                await tx.user.updateMany({
                    where: { teamId },
                    data: { teamId: null },
                });
                if (memberNames.length > 0) {
                    for (const username of memberNames) {
                        let user = await tx.user.findFirst({
                            where: { username }
                        });
                        if (!user) {
                            user = await tx.user.create({
                                data: {
                                    id: `user-${(0, crypto_1.randomUUID)().slice(0, 8)}`,
                                    username: username,
                                    email: `${username}@internal.com`,
                                }
                            });
                        }
                        await tx.user.update({
                            where: { id: user.id },
                            data: { teamId }
                        });
                    }
                }
            }
            return this.getTeamDetailWithTx(teamId, tx);
        });
    }
    async getTeamDetailWithTx(id, tx) {
        const team = await tx.team.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                },
                _count: {
                    select: {
                        projects: true
                    }
                }
            }
        });
        if (!team) {
            throw new common_1.NotFoundException('小组不存在');
        }
        const data = {
            id: team.id,
            name: team.name,
            description: team.description,
            leaderName: team.leaderName,
            memberCount: team.users.length,
            projectCount: team._count.projects,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            leaderId: null,
            members: team.users.map(u => ({
                id: u.id,
                username: u.username,
                email: u.email,
                isLeader: false,
            })),
        };
        return {
            success: true,
            data,
        };
    }
    async deleteTeam(teamId) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId }
        });
        if (!team) {
            throw new common_1.NotFoundException('小组不存在');
        }
        await this.prisma.user.updateMany({
            where: { teamId },
            data: { teamId: null },
        });
        await this.prisma.project.updateMany({
            where: { teamId },
            data: { teamId: null },
        });
        await this.prisma.teamStatistic.deleteMany({
            where: { teamId },
        });
        await this.prisma.team.delete({
            where: { id: teamId },
        });
        return {
            success: true,
            message: '小组删除成功',
        };
    }
    async getAvailableUsers() {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { teamId: null },
                    { teamId: '' }
                ]
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
            orderBy: {
                username: 'asc',
            },
        });
        return {
            success: true,
            data: users.map(u => ({
                id: u.id,
                username: u.username,
                email: u.email,
                isLeader: false,
            })),
        };
    }
    async addMember(teamId, username, email, isLeader) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId }
        });
        if (!team) {
            throw new common_1.NotFoundException('小组不存在');
        }
        let user = await this.prisma.user.findFirst({
            where: { username }
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    id: `user-${(0, crypto_1.randomUUID)().slice(0, 8)}`,
                    username,
                    email: email || `${username}@internal.com`,
                    teamId,
                }
            });
        }
        else {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { teamId }
            });
        }
        if (isLeader) {
            await this.prisma.team.update({
                where: { id: teamId },
                data: { leaderName: username }
            });
        }
        return {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                isLeader: isLeader || false,
            },
        };
    }
    async removeMember(teamId, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user || user.teamId !== teamId) {
            throw new common_1.NotFoundException('该用户不在该小组中');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { teamId: null }
        });
        return {
            success: true,
            message: '成员移除成功',
        };
    }
    async getTeamReport(teamId, dto) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
        });
        if (!team) {
            throw new common_1.NotFoundException('小组不存在');
        }
        const periodType = dto.periodType || 'week';
        const periodValue = dto.periodValue || this.getCurrentPeriodValue(periodType);
        const teamStatistic = await this.prisma.teamStatistic.findUnique({
            where: {
                teamId_periodType_periodValue: { teamId, periodType, periodValue },
            },
        });
        const users = await this.prisma.user.findMany({
            where: { teamId },
        });
        const userIds = users.map((u) => u.id);
        const memberAnalyses = await this.prisma.codeAnalysis.findMany({
            where: {
                userId: { in: userIds },
                periodType,
                periodValue,
            },
            include: {
                user: true,
                project: true,
            },
        });
        const memberMap = new Map();
        for (const analysis of memberAnalyses) {
            const existing = memberMap.get(analysis.userId) || {
                id: analysis.userId,
                username: analysis.user.username,
                email: analysis.user.email,
                avatar: analysis.user.avatar,
                commitCount: 0,
                insertions: 0,
                deletions: 0,
                codeLines: 0,
                taskCount: 0,
                projects: [],
            };
            existing.commitCount += analysis.commitCount;
            existing.insertions += analysis.insertions;
            existing.deletions += analysis.deletions;
            existing.codeLines += analysis.codeLines;
            existing.taskCount += analysis.taskCount || 0;
            if (analysis.project && !existing.projects.includes(analysis.project.name)) {
                existing.projects.push(analysis.project.name);
            }
            memberMap.set(analysis.userId, existing);
        }
        const members = Array.from(memberMap.values()).map((member) => {
            const memberScores = memberAnalyses
                .filter((a) => a.userId === member.id && a.aiQualityScore)
                .map((a) => Number(a.aiQualityScore));
            return {
                id: member.id,
                username: member.username,
                email: member.email,
                avatar: member.avatar,
                commitCount: member.commitCount,
                insertions: member.insertions,
                deletions: member.deletions,
                codeLines: member.codeLines,
                aiQualityScore: this.calculateAverageScore(memberScores),
                taskCount: member.taskCount,
                projects: member.projects.join(', ') || '-',
            };
        });
        const teamProjects = await this.prisma.project.findMany({
            where: { teamId },
        });
        const projectIds = teamProjects.map((p) => p.id);
        const projectStatistics = await this.prisma.projectStatistic.findMany({
            where: {
                projectId: { in: projectIds },
                periodType,
                periodValue,
            },
        });
        const projectAnalysesMap = new Map();
        for (const analysis of memberAnalyses) {
            if (analysis.project) {
                const existing = projectAnalysesMap.get(analysis.project.id) || {
                    id: analysis.project.id,
                    name: analysis.project.name,
                    repository: analysis.project.repository,
                    techStack: null,
                    contributorCount: 0,
                    commitCount: 0,
                    insertions: 0,
                    deletions: 0,
                    codeLines: 0,
                    aiQualityScore: null,
                    scoreSum: 0,
                    scoreCount: 0,
                };
                existing.contributorCount += 1;
                existing.commitCount += analysis.commitCount;
                existing.insertions += analysis.insertions;
                existing.deletions += analysis.deletions;
                existing.codeLines += analysis.codeLines;
                if (analysis.aiQualityScore) {
                    existing.scoreSum += Number(analysis.aiQualityScore);
                    existing.scoreCount += 1;
                }
                projectAnalysesMap.set(analysis.project.id, existing);
            }
        }
        const allProjectIds = new Set([...projectIds, ...Array.from(projectAnalysesMap.keys())]);
        const projects = [];
        for (const projectId of allProjectIds) {
            const teamProject = teamProjects.find((p) => p.id === projectId);
            const stat = projectStatistics.find((s) => s.projectId === projectId);
            const fromAnalyses = projectAnalysesMap.get(projectId);
            if (stat) {
                projects.push({
                    id: projectId,
                    name: teamProject?.name || fromAnalyses?.name || 'Unknown',
                    repository: teamProject?.repository || fromAnalyses?.repository,
                    techStack: teamProject?.techStack || null,
                    contributorCount: stat.totalContributors || 0,
                    commitCount: stat.totalCommits || 0,
                    insertions: stat.totalInsertions || 0,
                    deletions: stat.totalDeletions || 0,
                    codeLines: stat.totalLines || 0,
                    aiQualityScore: stat.avgQualityScore ? Number(stat.avgQualityScore) : null,
                });
            }
            else if (fromAnalyses) {
                projects.push({
                    id: fromAnalyses.id,
                    name: fromAnalyses.name,
                    repository: fromAnalyses.repository,
                    techStack: fromAnalyses.techStack,
                    contributorCount: fromAnalyses.contributorCount,
                    commitCount: fromAnalyses.commitCount,
                    insertions: fromAnalyses.insertions,
                    deletions: fromAnalyses.deletions,
                    codeLines: fromAnalyses.codeLines,
                    aiQualityScore: fromAnalyses.scoreCount > 0 ? fromAnalyses.scoreSum / fromAnalyses.scoreCount : null,
                });
            }
            else if (teamProject) {
                projects.push({
                    id: teamProject.id,
                    name: teamProject.name,
                    repository: teamProject.repository,
                    techStack: teamProject.techStack,
                    contributorCount: 0,
                    commitCount: 0,
                    insertions: 0,
                    deletions: 0,
                    codeLines: 0,
                    aiQualityScore: null,
                });
            }
        }
        const totalCommits = teamStatistic?.totalCommits || memberAnalyses.reduce((sum, a) => sum + a.commitCount, 0);
        const totalTasks = teamStatistic?.totalTasks || memberAnalyses.reduce((sum, a) => sum + (a.taskCount || 0), 0);
        const avgScore = teamStatistic?.avgQualityScore ? Number(teamStatistic.avgQualityScore) :
            (memberAnalyses.length > 0 ?
                memberAnalyses.filter(a => a.aiQualityScore).reduce((sum, a) => sum + Number(a.aiQualityScore), 0) /
                    memberAnalyses.filter(a => a.aiQualityScore).length : null);
        const hasData = !!teamStatistic || memberAnalyses.length > 0;
        const report = {
            teamId: team.id,
            teamName: team.name,
            leaderName: team.leaderName || '未设置',
            periodType,
            periodValue,
            totalMembers: teamStatistic?.totalMembers || users.length,
            activeMembers: teamStatistic?.activeMembers || members.length,
            totalCommits,
            totalInsertions: teamStatistic?.totalInsertions || memberAnalyses.reduce((sum, a) => sum + a.insertions, 0),
            totalDeletions: teamStatistic?.totalDeletions || memberAnalyses.reduce((sum, a) => sum + a.deletions, 0),
            totalTasks,
            avgQualityScore: avgScore,
            aiSummary: hasData ? (teamStatistic?.aiSummary ||
                `本周${team.name}共完成 ${totalCommits} 次提交，涉及 ${totalTasks} 个需求任务。代码质量${avgScore && avgScore >= 7 ? '良好' : '一般'}，平均得分 ${avgScore?.toFixed(1) || '-'} 分。`) : '本周暂无代码提交数据',
            aiRating: hasData ? (teamStatistic?.aiRating || (avgScore && avgScore >= 8 ? '优秀' : avgScore && avgScore >= 7 ? '良好' : '一般')) : '-',
            aiAdvantages: hasData ? (teamStatistic?.aiAdvantages || ['团队整体代码质量良好', '任务完成效率高']) : [],
            aiSuggestions: hasData ? (teamStatistic?.aiSuggestions || ['建议完善单元测试覆盖率', '持续优化代码结构']) : [],
            reportGeneratedAt: teamStatistic?.createdAt || new Date(),
            members,
            projects: projects.filter(p => p.commitCount > 0),
        };
        return {
            success: true,
            data: report,
        };
    }
    getCurrentPeriodValue(periodType) {
        const now = new Date();
        if (periodType === 'month') {
            return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
        else if (periodType === 'quarter') {
            return `${now.getFullYear()}Q${Math.floor(now.getMonth() / 3) + 1}`;
        }
        else {
            const d = new Date(now);
            d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7));
            return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        }
    }
    calculateAverageScore(scores) {
        if (scores.length === 0)
            return null;
        const sum = scores.reduce((acc, score) => acc + score, 0);
        return Math.round((sum / scores.length) * 100) / 100;
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map