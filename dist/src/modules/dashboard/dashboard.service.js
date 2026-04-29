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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(dto) {
        const [teamStats, totalTasks] = await Promise.all([
            this.prisma.teamStatistic.findMany({
                where: {
                    periodType: dto.periodType,
                    periodValue: dto.periodValue,
                },
            }),
            this.prisma.taskDifficultyScore.count({
                where: {
                    periodType: dto.periodType,
                    periodValue: dto.periodValue,
                },
            }),
        ]);
        const overview = {
            totalMembers: teamStats.reduce((sum, s) => sum + s.totalMembers, 0),
            totalCommits: teamStats.reduce((sum, s) => sum + s.totalCommits, 0),
            totalTasks,
            avgQualityScore: this.calculateAverageScore(teamStats
                .filter((s) => s.totalCommits > 0 && s.avgQualityScore !== null && Number(s.avgQualityScore) > 0)
                .map((s) => Number(s.avgQualityScore))),
        };
        return {
            success: true,
            data: overview,
        };
    }
    async getTeamDashboards(dto) {
        const periodFilter = {
            periodType: dto.periodType,
            periodValue: dto.periodValue,
        };
        const [teams, taskScores, users] = await Promise.all([
            this.prisma.team.findMany({
                include: {
                    statistics: { where: periodFilter },
                },
            }),
            this.prisma.taskDifficultyScore.findMany({
                where: periodFilter,
                select: { taskNo: true, committers: true },
            }),
            this.prisma.user.findMany({
                select: { username: true, teamId: true },
            }),
        ]);
        const userToTeam = new Map();
        for (const u of users) {
            if (u.teamId)
                userToTeam.set(u.username, u.teamId);
        }
        const teamTaskNos = new Map();
        for (const t of taskScores) {
            const committers = t.committers || [];
            const teamIds = new Set();
            for (const c of committers) {
                const tid = userToTeam.get(c);
                if (tid)
                    teamIds.add(tid);
            }
            for (const tid of teamIds) {
                if (!teamTaskNos.has(tid))
                    teamTaskNos.set(tid, new Set());
                teamTaskNos.get(tid).add(t.taskNo);
            }
        }
        const dashboards = teams.map((team) => {
            const stat = team.statistics[0];
            return {
                id: team.id,
                name: team.name,
                leader: team.leaderName,
                totalMembers: stat?.totalMembers || 0,
                activeMembers: stat?.activeMembers || 0,
                totalCommits: stat?.totalCommits || 0,
                totalTasks: teamTaskNos.get(team.id)?.size ?? 0,
                insertions: stat?.totalInsertions || 0,
                deletions: stat?.totalDeletions || 0,
                avgQualityScore: stat?.avgQualityScore || null,
            };
        });
        return {
            success: true,
            data: dashboards,
        };
    }
    async getProjectAnalysisList(dto) {
        const where = {
            periodType: dto.periodType,
            periodValue: dto.periodValue,
        };
        if (dto.projectId) {
            where.projectId = dto.projectId;
        }
        if (dto.version) {
            where.OR = [
                { branch: dto.version },
                { currentVersion: dto.version },
            ];
        }
        if (dto.userName) {
            where.user = { username: { contains: dto.userName, mode: 'insensitive' } };
        }
        const allAnalyses = await this.prisma.codeAnalysis.findMany({
            where,
            include: {
                user: {
                    include: { team: true }
                },
                project: true,
            },
        });
        const projectMap = new Map();
        for (const analysis of allAnalyses) {
            const projectId = analysis.projectId;
            if (!projectMap.has(projectId)) {
                projectMap.set(projectId, {
                    projectId,
                    projectName: analysis.project.name,
                    branch: analysis.branch || analysis.currentVersion || '',
                    compareVersion: analysis.compareVersion || '',
                    commitCount: 0,
                    insertions: 0,
                    deletions: 0,
                    contributors: [],
                });
            }
            const projectData = projectMap.get(projectId);
            projectData.commitCount += analysis.commitCount;
            projectData.insertions += analysis.insertions;
            projectData.deletions += analysis.deletions;
            const exists = projectData.contributors.some(c => c.userId === analysis.userId);
            if (!exists && analysis.user) {
                projectData.contributors.push({
                    userId: analysis.userId,
                    userName: analysis.user.username,
                });
            }
        }
        let items = Array.from(projectMap.values()).map(data => ({
            id: data.projectId,
            ...data,
        }));
        const page = Number(dto.page) || 1;
        const limit = Number(dto.limit) || 10;
        const skip = (page - 1) * limit;
        const total = items.length;
        const paginatedItems = items.slice(skip, skip + limit);
        return {
            success: true,
            data: paginatedItems,
            meta: {
                total,
                page,
                limit,
                hasMore: total > page * limit,
            },
        };
    }
    async getCodeAnalysisList(dto) {
        const page = Number(dto.page) || 1;
        const limit = Number(dto.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {
            periodType: dto.periodType,
            periodValue: dto.periodValue,
        };
        if (dto.teamId) {
            where.user = { teamId: dto.teamId };
        }
        if (dto.projectId) {
            where.projectId = dto.projectId;
        }
        if (dto.userName) {
            if (!where.user)
                where.user = {};
            where.user.username = { contains: dto.userName, mode: 'insensitive' };
        }
        const allAnalyses = await this.prisma.codeAnalysis.findMany({
            where,
            include: {
                user: {
                    include: { team: true }
                },
                project: true,
            },
        });
        const userMap = new Map();
        for (const analysis of allAnalyses) {
            const userId = analysis.userId;
            if (!userMap.has(userId)) {
                userMap.set(userId, {
                    userId,
                    userName: analysis.user.username,
                    teamId: analysis.user.teamId || '',
                    teamName: analysis.user.team?.name || '',
                    projects: [],
                    insertions: 0,
                    deletions: 0,
                    commitCount: 0,
                    taskCount: 0,
                    qualityScores: [],
                });
            }
            const userData = userMap.get(userId);
            const projectExists = userData.projects.some(p => p.id === analysis.projectId);
            if (!projectExists) {
                userData.projects.push({
                    id: analysis.projectId,
                    name: analysis.project.name,
                });
            }
            userData.insertions += analysis.insertions;
            userData.deletions += analysis.deletions;
            userData.commitCount += analysis.commitCount;
            userData.taskCount += analysis.taskCount || 0;
            if (analysis.aiQualityScore) {
                userData.qualityScores.push(Number(analysis.aiQualityScore));
            }
        }
        let items = Array.from(userMap.values()).map(userData => {
            const avgScore = userData.qualityScores.length > 0
                ? userData.qualityScores.reduce((a, b) => a + b, 0) / userData.qualityScores.length
                : null;
            const sortedProjects = userData.projects.sort((a, b) => a.name.localeCompare(b.name));
            return {
                id: userData.userId,
                userName: userData.userName,
                userId: userData.userId,
                teamName: userData.teamName,
                teamId: userData.teamId,
                projectName: sortedProjects.map(p => p.name).join('、'),
                projectIds: sortedProjects.map(p => p.id),
                projectId: sortedProjects[0]?.id || '',
                insertions: userData.insertions,
                deletions: userData.deletions,
                commitCount: userData.commitCount,
                totalTasks: userData.taskCount,
                aiQualityScore: avgScore ? avgScore.toFixed(1) : null,
                qualityLevel: this.getQualityLevel(avgScore),
            };
        });
        const sortBy = dto.sortBy || 'insertions';
        const sortOrder = dto.sortOrder || 'desc';
        items.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy) {
                case 'insertions':
                    aVal = a.insertions;
                    bVal = b.insertions;
                    break;
                case 'deletions':
                    aVal = a.deletions;
                    bVal = b.deletions;
                    break;
                case 'commitCount':
                    aVal = a.commitCount;
                    bVal = b.commitCount;
                    break;
                case 'totalTasks':
                    aVal = a.totalTasks;
                    bVal = b.totalTasks;
                    break;
                case 'aiQualityScore':
                    aVal = a.aiQualityScore ? parseFloat(a.aiQualityScore) : 0;
                    bVal = b.aiQualityScore ? parseFloat(b.aiQualityScore) : 0;
                    break;
                default:
                    aVal = a.insertions;
                    bVal = b.insertions;
            }
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });
        const total = items.length;
        const paginatedItems = items.slice(skip, skip + limit);
        return {
            success: true,
            data: paginatedItems,
            meta: {
                total,
                page,
                limit,
                hasMore: total > page * limit,
            },
        };
    }
    getQualityLevel(score) {
        if (score === null)
            return '良好';
        if (score >= 9)
            return '优秀';
        if (score >= 7)
            return '良好';
        if (score >= 5)
            return '一般';
        return '较差';
    }
    async getFilterOptions(dto) {
        const analyses = await this.prisma.codeAnalysis.findMany({
            where: {
                periodType: dto.periodType,
                periodValue: dto.periodValue,
            },
            include: {
                user: {
                    include: { team: true }
                },
                project: true,
            },
        });
        const teamsMap = new Map();
        analyses.forEach(a => {
            if (a.user.team) {
                teamsMap.set(a.user.team.id, {
                    id: a.user.team.id,
                    name: a.user.team.name,
                });
            }
        });
        const projectsMap = new Map();
        analyses.forEach(a => {
            projectsMap.set(a.project.id, {
                id: a.project.id,
                name: a.project.name,
            });
        });
        const usersMap = new Map();
        analyses.forEach(a => {
            usersMap.set(a.user.id, {
                id: a.user.id,
                name: a.user.username,
            });
        });
        const versionsSet = new Set();
        analyses.forEach(a => {
            if (a.currentVersion && !a.currentVersion.startsWith('origin/')) {
                versionsSet.add(a.currentVersion);
            }
            if (a.branch && !a.branch.startsWith('origin/') && !versionsSet.has(a.branch)) {
                versionsSet.add(a.branch);
            }
        });
        return {
            success: true,
            data: {
                teams: Array.from(teamsMap.values()),
                projects: Array.from(projectsMap.values()),
                users: Array.from(usersMap.values()),
                versions: Array.from(versionsSet).map(v => ({ value: v, label: v })),
            },
        };
    }
    async getPeriods(periodType) {
        const type = periodType || 'week';
        const rows = await this.prisma.codeAnalysis.findMany({
            where: { periodType: type },
            select: { periodValue: true },
            distinct: ['periodValue'],
            orderBy: { periodValue: 'desc' },
        });
        return { success: true, data: rows.map((r) => r.periodValue) };
    }
    calculateAverageScore(scores) {
        if (scores.length === 0) {
            return null;
        }
        const sum = scores.reduce((acc, score) => acc + Number(score), 0);
        return Math.round((sum / scores.length) * 100) / 100;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map