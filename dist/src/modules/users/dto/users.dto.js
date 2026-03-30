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
exports.UserAnalysisDto = exports.CodeAnalysisItemDto = exports.UserStatisticsDto = exports.UserBasicInfoDto = exports.UserAnalysisQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserAnalysisQueryDto {
    periodType = 'week';
    periodValue;
    projectId;
    page = 1;
    limit = 10;
}
exports.UserAnalysisQueryDto = UserAnalysisQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '周期类型',
        enum: ['week', 'month', 'quarter'],
        default: 'week',
        required: false,
    }),
    __metadata("design:type", String)
], UserAnalysisQueryDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值', required: false }),
    __metadata("design:type", String)
], UserAnalysisQueryDto.prototype, "periodValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID（可选，不传则返回所有项目的汇总）', required: false }),
    __metadata("design:type", String)
], UserAnalysisQueryDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '页码', default: 1, required: false }),
    __metadata("design:type", Number)
], UserAnalysisQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '每页数量', default: 10, required: false }),
    __metadata("design:type", Number)
], UserAnalysisQueryDto.prototype, "limit", void 0);
class UserBasicInfoDto {
    id;
    username;
    email;
    avatar;
    teamId;
    teamName;
    gitUsername;
    gitEmail;
}
exports.UserBasicInfoDto = UserBasicInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱' }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '头像', required: false }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID', required: false }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称', required: false }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "teamName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Git用户名', required: false }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "gitUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Git邮箱', required: false }),
    __metadata("design:type", String)
], UserBasicInfoDto.prototype, "gitEmail", void 0);
class UserStatisticsDto {
    totalCommits;
    totalInsertions;
    totalDeletions;
    totalCodeLines;
    totalTasks;
    avgQualityScore;
}
exports.UserStatisticsDto = UserStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总提交次数' }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "totalCommits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总新增行数' }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "totalInsertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总删除行数' }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "totalDeletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总代码行数' }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "totalCodeLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总任务数' }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '平均质量分', nullable: true }),
    __metadata("design:type", Object)
], UserStatisticsDto.prototype, "avgQualityScore", void 0);
class CodeAnalysisItemDto {
    id;
    projectId;
    projectName;
    periodType;
    periodValue;
    commitCount;
    insertions;
    deletions;
    codeLines;
    aiQualityScore;
    taskCount;
    createdAt;
}
exports.CodeAnalysisItemDto = CodeAnalysisItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '分析ID' }),
    __metadata("design:type", String)
], CodeAnalysisItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID' }),
    __metadata("design:type", String)
], CodeAnalysisItemDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目名称' }),
    __metadata("design:type", String)
], CodeAnalysisItemDto.prototype, "projectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期类型' }),
    __metadata("design:type", String)
], CodeAnalysisItemDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值' }),
    __metadata("design:type", String)
], CodeAnalysisItemDto.prototype, "periodValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '提交次数' }),
    __metadata("design:type", Number)
], CodeAnalysisItemDto.prototype, "commitCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新增行数' }),
    __metadata("design:type", Number)
], CodeAnalysisItemDto.prototype, "insertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除行数' }),
    __metadata("design:type", Number)
], CodeAnalysisItemDto.prototype, "deletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码行数' }),
    __metadata("design:type", Number)
], CodeAnalysisItemDto.prototype, "codeLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI质量评分', nullable: true }),
    __metadata("design:type", Object)
], CodeAnalysisItemDto.prototype, "aiQualityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '任务数量' }),
    __metadata("design:type", Number)
], CodeAnalysisItemDto.prototype, "taskCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    __metadata("design:type", Date)
], CodeAnalysisItemDto.prototype, "createdAt", void 0);
class UserAnalysisDto {
    user;
    statistics;
    analyses;
    meta;
}
exports.UserAnalysisDto = UserAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户基本信息' }),
    __metadata("design:type", UserBasicInfoDto)
], UserAnalysisDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '统计数据（指定周期内）' }),
    __metadata("design:type", UserStatisticsDto)
], UserAnalysisDto.prototype, "statistics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码分析记录列表' }),
    __metadata("design:type", Array)
], UserAnalysisDto.prototype, "analyses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '分页信息' }),
    __metadata("design:type", Object)
], UserAnalysisDto.prototype, "meta", void 0);
//# sourceMappingURL=users.dto.js.map