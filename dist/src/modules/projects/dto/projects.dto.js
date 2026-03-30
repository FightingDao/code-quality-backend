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
exports.ProjectReportDto = exports.ProjectListItemDto = exports.ProjectReportQueryDto = exports.ProjectListQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProjectListQueryDto {
    page = 1;
    limit = 10;
    teamId;
    isActive;
}
exports.ProjectListQueryDto = ProjectListQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '页码', default: 1, required: false }),
    __metadata("design:type", Number)
], ProjectListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '每页数量', default: 10, required: false }),
    __metadata("design:type", Number)
], ProjectListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID', required: false }),
    __metadata("design:type", String)
], ProjectListQueryDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否激活', required: false }),
    __metadata("design:type", Boolean)
], ProjectListQueryDto.prototype, "isActive", void 0);
class ProjectReportQueryDto {
    periodType = 'week';
    periodValue;
}
exports.ProjectReportQueryDto = ProjectReportQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '周期类型',
        enum: ['week', 'month', 'quarter'],
        default: 'week',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['week', 'month', 'quarter']),
    __metadata("design:type", String)
], ProjectReportQueryDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProjectReportQueryDto.prototype, "periodValue", void 0);
class ProjectListItemDto {
    id;
    name;
    repository;
    description;
    teamId;
    teamName;
    techStack;
    isActive;
    defaultBranch;
    lastCommitAt;
    createdAt;
    updatedAt;
}
exports.ProjectListItemDto = ProjectListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID' }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目名称' }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '仓库地址' }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "repository", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目描述', required: false }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID', required: false }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称', required: false }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "teamName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '技术栈', required: false }),
    __metadata("design:type", Object)
], ProjectListItemDto.prototype, "techStack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否激活' }),
    __metadata("design:type", Boolean)
], ProjectListItemDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '默认分支', required: false }),
    __metadata("design:type", String)
], ProjectListItemDto.prototype, "defaultBranch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '最后提交时间', required: false }),
    __metadata("design:type", Date)
], ProjectListItemDto.prototype, "lastCommitAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    __metadata("design:type", Date)
], ProjectListItemDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新时间' }),
    __metadata("design:type", Date)
], ProjectListItemDto.prototype, "updatedAt", void 0);
class ProjectReportDto {
    id;
    name;
    repository;
    description;
    teamId;
    teamName;
    techStack;
    isActive;
    defaultBranch;
    lastCommitAt;
    periodType;
    periodValue;
    totalContributors;
    totalCommits;
    totalInsertions;
    totalDeletions;
    totalTasks;
    totalLines;
    avgQualityScore;
}
exports.ProjectReportDto = ProjectReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID' }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目名称' }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '仓库地址' }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "repository", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目描述', required: false }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID', required: false }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称', required: false }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "teamName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '技术栈', required: false }),
    __metadata("design:type", Object)
], ProjectReportDto.prototype, "techStack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否激活' }),
    __metadata("design:type", Boolean)
], ProjectReportDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '默认分支', required: false }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "defaultBranch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '最后提交时间', required: false }),
    __metadata("design:type", Date)
], ProjectReportDto.prototype, "lastCommitAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期类型' }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值' }),
    __metadata("design:type", String)
], ProjectReportDto.prototype, "periodValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总贡献者数' }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "totalContributors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总提交数' }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "totalCommits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总新增行数' }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "totalInsertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总删除行数' }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "totalDeletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总任务数' }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总代码行数' }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "totalLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '平均质量分数', required: false }),
    __metadata("design:type", Number)
], ProjectReportDto.prototype, "avgQualityScore", void 0);
//# sourceMappingURL=projects.dto.js.map