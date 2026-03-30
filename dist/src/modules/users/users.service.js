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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserAnalysis(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                team: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`用户 ${userId} 不存在`);
        }
        const where = { userId };
        if (dto.periodType) {
            where.periodType = dto.periodType;
        }
        if (dto.periodValue) {
            where.periodValue = dto.periodValue;
        }
        if (dto.projectId) {
            where.projectId = dto.projectId;
        }
        const page = dto.page || 1;
        const limit = dto.limit || 10;
        const skip = (page - 1) * limit;
        const [analyses, total, statsResult, reviews] = await Promise.all([
            this.prisma.codeAnalysis.findMany({
                where,
                skip,
                take: limit,
                include: {
                    project: {
                        include: { team: true }
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.codeAnalysis.count({ where }),
            this.prisma.codeAnalysis.aggregate({
                where,
                _sum: {
                    commitCount: true,
                    insertions: true,
                    deletions: true,
                    codeLines: true,
                    taskCount: true,
                },
                _avg: {
                    aiQualityScore: true,
                },
            }),
            this.prisma.codeReview.findMany({
                where: {
                    committerId: userId,
                    analysis: {
                        periodType: dto.periodType,
                        periodValue: dto.periodValue,
                        ...(dto.projectId ? { projectId: dto.projectId } : {})
                    }
                },
                include: {
                    analysis: {
                        include: { project: true }
                    }
                },
                orderBy: { commitDate: 'desc' }
            })
        ]);
        const projectAnalyses = await this.prisma.codeAnalysis.findMany({
            where: {
                userId,
                periodType: dto.periodType,
                periodValue: dto.periodValue
            },
            include: {
                project: true
            }
        });
        const projects = projectAnalyses.map(a => ({
            id: a.projectId,
            name: a.project.name,
            commitCount: a.commitCount,
            insertions: a.insertions,
            deletions: a.deletions,
            aiQualityScore: a.aiQualityScore ? Number(a.aiQualityScore) : null
        }));
        const userBasicInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            teamId: user.teamId,
            teamName: user.team?.name,
            gitUsername: user.gitUsername,
            gitEmail: user.gitEmail,
            reportTime: analyses[0]?.createdAt || new Date(),
        };
        const statistics = {
            totalCommits: statsResult._sum.commitCount || 0,
            totalInsertions: statsResult._sum.insertions || 0,
            totalDeletions: statsResult._sum.deletions || 0,
            netGrowth: (statsResult._sum.insertions || 0) - (statsResult._sum.deletions || 0),
            totalCodeLines: statsResult._sum.codeLines || 0,
            totalTasks: statsResult._sum.taskCount || 0,
            avgQualityScore: statsResult._avg.aiQualityScore
                ? Math.round(statsResult._avg.aiQualityScore * 100) / 100
                : null,
        };
        const latestAnalysis = analyses[0];
        let issues = [];
        let suggestions = [];
        let advantages = [];
        let overallEvaluation = '良好';
        if (latestAnalysis?.aiQualityReport) {
            const reportContent = latestAnalysis.aiQualityReport;
            const issuesMatch = reportContent.match(/### 主要问题\n([\s\S]*?)(?=\n###|$)/);
            if (issuesMatch) {
                const content = issuesMatch[1].trim();
                const numberedLines = content.split('\n')
                    .filter((line) => line.trim().match(/^\d+\./))
                    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
                if (numberedLines.length > 0) {
                    issues = numberedLines;
                }
                else if (content && !content.includes('暂无')) {
                    issues = [content];
                }
            }
            const suggestionsMatch = reportContent.match(/### 改进建议\n([\s\S]*?)(?=\n###|$)/);
            if (suggestionsMatch) {
                const content = suggestionsMatch[1].trim();
                const numberedLines = content.split('\n')
                    .filter((line) => line.trim().match(/^\d+\./))
                    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
                if (numberedLines.length > 0) {
                    suggestions = numberedLines;
                }
                else if (content && !content.includes('暂无')) {
                    suggestions = [content];
                }
            }
            const advantagesMatch = reportContent.match(/### 亮点\n([\s\S]*?)(?=\n###|$)/);
            if (advantagesMatch) {
                const content = advantagesMatch[1].trim();
                const numberedLines = content.split('\n')
                    .filter((line) => line.trim().match(/^\d+\./))
                    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
                if (numberedLines.length > 0) {
                    advantages = numberedLines;
                }
                else if (content && !content.includes('暂无')) {
                    advantages = [content];
                }
            }
            const ratingMatch = reportContent.match(/### 总体评价：(.+)/);
            if (ratingMatch) {
                overallEvaluation = ratingMatch[1].trim();
            }
        }
        let commitTypes = {};
        let fileChanges = [];
        if (latestAnalysis?.languages) {
            const langData = latestAnalysis.languages;
            if (langData.commitTypes) {
                commitTypes = langData.commitTypes;
            }
        }
        if (Object.keys(commitTypes).length === 0 && reviews.length > 0) {
            for (const r of reviews) {
                let commitType = '其他';
                if (r.reviewResult) {
                    try {
                        const result = JSON.parse(r.reviewResult);
                        const typeMap = {
                            'feat': '新功能',
                            'fix': 'Bug修复',
                            'refactor': '重构',
                            'style': '样式',
                            'test': '测试',
                            'docs': '文档',
                            'chore': '杂项',
                            'perf': '性能优化',
                            '新功能': '新功能',
                            'Bug修复': 'Bug修复',
                            '重构': '重构',
                            '样式': '样式',
                            '测试': '测试',
                            '文档': '文档',
                            '杂项': '杂项',
                            '性能优化': '性能优化',
                            '其他': '其他',
                            'other': '其他'
                        };
                        commitType = typeMap[result.type] || result.type || '其他';
                    }
                    catch (e) { }
                }
                if (commitType === '其他' && r.commitMessage) {
                    if (r.commitMessage.startsWith('feat'))
                        commitType = '新功能';
                    else if (r.commitMessage.startsWith('fix'))
                        commitType = 'Bug修复';
                    else if (r.commitMessage.startsWith('refactor'))
                        commitType = '重构';
                    else if (r.commitMessage.startsWith('style'))
                        commitType = '样式';
                    else if (r.commitMessage.startsWith('test'))
                        commitType = '测试';
                    else if (r.commitMessage.startsWith('docs'))
                        commitType = '文档';
                    else if (r.commitMessage.startsWith('chore'))
                        commitType = '杂项';
                    else if (r.commitMessage.startsWith('perf'))
                        commitType = '性能优化';
                }
                commitTypes[commitType] = (commitTypes[commitType] || 0) + 1;
            }
        }
        if (latestAnalysis?.fileChanges) {
            fileChanges = latestAnalysis.fileChanges;
        }
        const report = {
            projectId: latestAnalysis?.projectId || null,
            projectName: latestAnalysis?.project?.name || null,
            branch: latestAnalysis?.branch || '',
            currentVersion: latestAnalysis?.currentVersion || '',
            compareVersion: latestAnalysis?.compareVersion || '',
            commitCount: latestAnalysis?.commitCount || 0,
            issues,
            suggestions,
            advantages,
            overallEvaluation,
            commitTypes,
            fileChanges
        };
        return {
            success: true,
            data: {
                user: userBasicInfo,
                statistics,
                report,
                projects,
                commits: reviews.map(r => {
                    let insertions = 0;
                    let deletions = 0;
                    let commitType = '其他';
                    if (r.reviewResult) {
                        try {
                            const result = JSON.parse(r.reviewResult);
                            insertions = result.insertions || 0;
                            deletions = result.deletions || 0;
                            const typeMap = {
                                'feat': '新功能',
                                'fix': 'Bug修复',
                                'refactor': '重构',
                                'style': '样式',
                                'test': '测试',
                                'docs': '文档',
                                'chore': '杂项',
                                'perf': '性能优化',
                                'other': '其他'
                            };
                            commitType = typeMap[result.type] || result.type || '其他';
                        }
                        catch (e) {
                        }
                    }
                    if (commitType === '其他' && r.commitMessage) {
                        if (r.commitMessage.startsWith('feat'))
                            commitType = '新功能';
                        else if (r.commitMessage.startsWith('fix'))
                            commitType = 'Bug修复';
                        else if (r.commitMessage.startsWith('refactor'))
                            commitType = '重构';
                    }
                    return {
                        hash: r.commitHash.substring(0, 7),
                        message: r.commitMessage,
                        type: commitType,
                        time: r.commitDate ? new Date(r.commitDate).toISOString() : null,
                        insertions,
                        deletions,
                        projectName: r.analysis?.project?.name || null
                    };
                }),
                meta: {
                    total,
                    page,
                    limit,
                    hasMore: total > page * limit,
                },
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map