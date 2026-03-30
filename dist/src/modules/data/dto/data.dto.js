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
exports.CalculateStatisticsDto = exports.BatchSyncUsersDto = exports.SyncUserDto = exports.BatchCreateCodeAnalysisDto = exports.CreateCodeAnalysisDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCodeAnalysisDto {
    userId;
    projectId;
    periodType;
    periodValue;
    commitCount;
    insertions;
    deletions;
    filesChanged;
    totalLines;
    codeLines;
    commentLines;
    blankLines;
    languages;
    fileChanges;
    aiQualityScore;
    aiQualityReport;
    taskCount;
}
exports.CreateCodeAnalysisDto = CreateCodeAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodeAnalysisDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodeAnalysisDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期类型', enum: ['week', 'month'] }),
    (0, class_validator_1.IsEnum)(['week', 'month']),
    __metadata("design:type", String)
], CreateCodeAnalysisDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值，周维度为YYYYMMDD，月维度为YYYYMM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodeAnalysisDto.prototype, "periodValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '提交次数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "commitCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新增行数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "insertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除行数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "deletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '变更文件数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "filesChanged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总行数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "totalLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码行数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "codeLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '注释行数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "commentLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '空白行数' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "blankLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '语言分布', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCodeAnalysisDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文件变更明细', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Array)
], CreateCodeAnalysisDto.prototype, "fileChanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI质量评分（0-10分）', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "aiQualityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI质量报告（Markdown格式）', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCodeAnalysisDto.prototype, "aiQualityReport", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '任务数量', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCodeAnalysisDto.prototype, "taskCount", void 0);
class BatchCreateCodeAnalysisDto {
    analyses;
}
exports.BatchCreateCodeAnalysisDto = BatchCreateCodeAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码分析数据数组', type: [CreateCodeAnalysisDto] }),
    __metadata("design:type", Array)
], BatchCreateCodeAnalysisDto.prototype, "analyses", void 0);
class SyncUserDto {
    username;
    email;
    avatar;
    teamId;
    gitUsername;
    gitEmail;
}
exports.SyncUserDto = SyncUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '头像', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncUserDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Git用户名', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncUserDto.prototype, "gitUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Git邮箱', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncUserDto.prototype, "gitEmail", void 0);
class BatchSyncUsersDto {
    users;
}
exports.BatchSyncUsersDto = BatchSyncUsersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户数据数组', type: [SyncUserDto] }),
    __metadata("design:type", Array)
], BatchSyncUsersDto.prototype, "users", void 0);
class CalculateStatisticsDto {
    periodType;
    periodValue;
    teamId;
    projectId;
}
exports.CalculateStatisticsDto = CalculateStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期类型', enum: ['week', 'month'] }),
    (0, class_validator_1.IsEnum)(['week', 'month']),
    __metadata("design:type", String)
], CalculateStatisticsDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateStatisticsDto.prototype, "periodValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID（可选，不传则计算所有小组）', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateStatisticsDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID（可选，不传则计算所有项目）', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateStatisticsDto.prototype, "projectId", void 0);
//# sourceMappingURL=data.dto.js.map