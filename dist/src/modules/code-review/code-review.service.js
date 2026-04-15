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
exports.CodeReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
function serializeBigInt(data) {
    if (data === null || data === undefined)
        return data;
    if (typeof data === 'bigint')
        return Number(data);
    if (Array.isArray(data))
        return data.map(serializeBigInt);
    if (typeof data === 'object') {
        const result = {};
        for (const key of Object.keys(data)) {
            result[key] = serializeBigInt(data[key]);
        }
        return result;
    }
    return data;
}
let CodeReviewService = class CodeReviewService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveProjectId(projectIdOrName) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(projectIdOrName)) {
            return projectIdOrName;
        }
        const projectById = await this.prisma.$queryRaw `
      SELECT id FROM projects WHERE id = ${projectIdOrName} LIMIT 1
    `;
        if (projectById.length > 0) {
            return projectById[0].id;
        }
        const projectByName = await this.prisma.$queryRaw `
      SELECT id FROM projects WHERE name = ${projectIdOrName} LIMIT 1
    `;
        return projectByName.length > 0 ? projectByName[0].id : null;
    }
    async saveIssues(analysisId, issues) {
        await this.prisma.$executeRaw `DELETE FROM code_issues WHERE analysis_id = ${analysisId}`;
        for (const issue of issues) {
            await this.prisma.$executeRaw `
        INSERT INTO code_issues (
          id, analysis_id, file_path, line_start, line_end, 
          issue_type, severity, description, suggestion, code_snippet, created_at, updated_at, committer_name
        ) VALUES (
          gen_random_uuid(), ${analysisId}, ${issue.filePath}, ${issue.lineStart || null}, ${issue.lineEnd || null},
          ${issue.type}, ${issue.severity}, ${issue.description}, ${issue.suggestion || null}, ${issue.codeSnippet || null},
          NOW(), NOW(), ${issue.committerName || null}
        )
      `;
        }
        return { count: issues.length };
    }
    async getProjectIssues(projectId, periodType, periodValue) {
        const issues = await this.prisma.$queryRaw `
      SELECT 
        ci.id, ci.file_path, ci.line_start, ci.line_end,
        ci.issue_type, ci.severity, ci.description, ci.suggestion, 
        ci.code_snippet, ci.code_example, ci.committer_name,
        ci.created_at
      FROM code_issues ci
      JOIN code_analyses ca ON ci.analysis_id = ca.id
      WHERE ca.project_id = ${projectId}
        AND ca.period_type = ${periodType}
        AND ca.period_value = ${periodValue}
      ORDER BY ci.severity, ci.file_path, ci.line_start
    `;
        return serializeBigInt(issues);
    }
    async getProjectReviewSummary(projectId, periodType, periodValue) {
        const stats = await this.prisma.$queryRaw `
      SELECT 
        severity,
        COUNT(*) as count
      FROM code_issues ci
      JOIN code_analyses ca ON ci.analysis_id = ca.id
      WHERE ca.project_id = ${projectId}
        AND ca.period_type = ${periodType}
        AND ca.period_value = ${periodValue}
      GROUP BY severity
    `;
        const typeStats = await this.prisma.$queryRaw `
      SELECT 
        issue_type,
        COUNT(*) as count
      FROM code_issues ci
      JOIN code_analyses ca ON ci.analysis_id = ca.id
      WHERE ca.project_id = ${projectId}
        AND ca.period_type = ${periodType}
        AND ca.period_value = ${periodValue}
      GROUP BY issue_type
      ORDER BY count DESC
    `;
        const fileStats = await this.prisma.$queryRaw `
      SELECT 
        file_path,
        COUNT(*) as issue_count,
        ARRAY_AGG(DISTINCT severity) as severities
      FROM code_issues ci
      JOIN code_analyses ca ON ci.analysis_id = ca.id
      WHERE ca.project_id = ${projectId}
        AND ca.period_type = ${periodType}
        AND ca.period_value = ${periodValue}
      GROUP BY file_path
      ORDER BY issue_count DESC
    `;
        return {
            stats: serializeBigInt(stats),
            typeStats: serializeBigInt(typeStats),
            fileStats: serializeBigInt(fileStats)
        };
    }
    async saveReviewReport(projectId, periodType, periodValue, report) {
        const analyses = await this.prisma.$queryRaw `
      SELECT id, user_id FROM code_analyses 
      WHERE project_id = ${projectId}
        AND period_type = ${periodType}
        AND period_value = ${periodValue}
    `;
        if (analyses.length === 0) {
            return { success: false, message: '未找到分析记录' };
        }
        for (const analysis of analyses) {
            const userIssues = report.issues.filter(i => !i.userId || i.userId === analysis.user_id);
            if (userIssues.length > 0) {
                await this.saveIssues(analysis.id, userIssues);
            }
        }
        return { success: true, issueCount: report.issues.length };
    }
};
exports.CodeReviewService = CodeReviewService;
exports.CodeReviewService = CodeReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CodeReviewService);
//# sourceMappingURL=code-review.service.js.map