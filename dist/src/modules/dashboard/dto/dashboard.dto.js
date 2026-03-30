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
exports.CodeAnalysisListItemDto = exports.TeamDashboardDto = exports.DashboardOverviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardOverviewDto {
    totalMembers;
    totalCommits;
    totalTasks;
    avgQualityScore;
}
exports.DashboardOverviewDto = DashboardOverviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总成员数' }),
    __metadata("design:type", Number)
], DashboardOverviewDto.prototype, "totalMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总提交数' }),
    __metadata("design:type", Number)
], DashboardOverviewDto.prototype, "totalCommits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总任务数' }),
    __metadata("design:type", Number)
], DashboardOverviewDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '平均质量分' }),
    __metadata("design:type", Object)
], DashboardOverviewDto.prototype, "avgQualityScore", void 0);
class TeamDashboardDto {
    id;
    name;
    totalMembers;
    activeMembers;
    totalCommits;
    insertions;
    deletions;
    avgQualityScore;
}
exports.TeamDashboardDto = TeamDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID' }),
    __metadata("design:type", String)
], TeamDashboardDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称' }),
    __metadata("design:type", String)
], TeamDashboardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总成员数' }),
    __metadata("design:type", Number)
], TeamDashboardDto.prototype, "totalMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '活跃成员数' }),
    __metadata("design:type", Number)
], TeamDashboardDto.prototype, "activeMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总提交数' }),
    __metadata("design:type", Number)
], TeamDashboardDto.prototype, "totalCommits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新增行数' }),
    __metadata("design:type", Number)
], TeamDashboardDto.prototype, "insertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除行数' }),
    __metadata("design:type", Number)
], TeamDashboardDto.prototype, "deletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '平均质量分' }),
    __metadata("design:type", Object)
], TeamDashboardDto.prototype, "avgQualityScore", void 0);
class CodeAnalysisListItemDto {
    id;
    userName;
    projectName;
    commitCount;
    insertions;
    deletions;
    codeLines;
    aiQualityScore;
    taskCount;
}
exports.CodeAnalysisListItemDto = CodeAnalysisListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '分析ID' }),
    __metadata("design:type", String)
], CodeAnalysisListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    __metadata("design:type", String)
], CodeAnalysisListItemDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目名称' }),
    __metadata("design:type", String)
], CodeAnalysisListItemDto.prototype, "projectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '提交次数' }),
    __metadata("design:type", Number)
], CodeAnalysisListItemDto.prototype, "commitCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新增行数' }),
    __metadata("design:type", Number)
], CodeAnalysisListItemDto.prototype, "insertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除行数' }),
    __metadata("design:type", Number)
], CodeAnalysisListItemDto.prototype, "deletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码行数' }),
    __metadata("design:type", Number)
], CodeAnalysisListItemDto.prototype, "codeLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI质量评分' }),
    __metadata("design:type", Object)
], CodeAnalysisListItemDto.prototype, "aiQualityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '任务数量' }),
    __metadata("design:type", Number)
], CodeAnalysisListItemDto.prototype, "taskCount", void 0);
//# sourceMappingURL=dashboard.dto.js.map