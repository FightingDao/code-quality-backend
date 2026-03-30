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
exports.CreateMemberDto = exports.TeamMemberSimpleDto = exports.TeamDetailDto = exports.UpdateTeamDto = exports.CreateTeamDto = exports.TeamReportDto = exports.TeamProjectDto = exports.TeamMemberDto = exports.TeamListItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TeamListItemDto {
    id;
    name;
    description;
    leaderName;
    memberCount;
    projectCount;
    createdAt;
    updatedAt;
}
exports.TeamListItemDto = TeamListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID' }),
    __metadata("design:type", String)
], TeamListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称' }),
    __metadata("design:type", String)
], TeamListItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组描述' }),
    __metadata("design:type", Object)
], TeamListItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组长姓名' }),
    __metadata("design:type", Object)
], TeamListItemDto.prototype, "leaderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '成员数量' }),
    __metadata("design:type", Number)
], TeamListItemDto.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目数量' }),
    __metadata("design:type", Number)
], TeamListItemDto.prototype, "projectCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    __metadata("design:type", Date)
], TeamListItemDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新时间' }),
    __metadata("design:type", Date)
], TeamListItemDto.prototype, "updatedAt", void 0);
class TeamMemberDto {
    id;
    username;
    email;
    avatar;
    commitCount;
    insertions;
    deletions;
    codeLines;
    aiQualityScore;
    taskCount;
}
exports.TeamMemberDto = TeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '头像' }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '提交次数' }),
    __metadata("design:type", Number)
], TeamMemberDto.prototype, "commitCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新增行数' }),
    __metadata("design:type", Number)
], TeamMemberDto.prototype, "insertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除行数' }),
    __metadata("design:type", Number)
], TeamMemberDto.prototype, "deletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码行数' }),
    __metadata("design:type", Number)
], TeamMemberDto.prototype, "codeLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI质量评分' }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "aiQualityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '任务数量' }),
    __metadata("design:type", Number)
], TeamMemberDto.prototype, "taskCount", void 0);
class TeamProjectDto {
    id;
    name;
    repository;
    techStack;
    contributorCount;
    commitCount;
    codeLines;
    aiQualityScore;
}
exports.TeamProjectDto = TeamProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目ID' }),
    __metadata("design:type", String)
], TeamProjectDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目名称' }),
    __metadata("design:type", String)
], TeamProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '仓库地址' }),
    __metadata("design:type", String)
], TeamProjectDto.prototype, "repository", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '技术栈' }),
    __metadata("design:type", Object)
], TeamProjectDto.prototype, "techStack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '贡献者数量' }),
    __metadata("design:type", Number)
], TeamProjectDto.prototype, "contributorCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '提交次数' }),
    __metadata("design:type", Number)
], TeamProjectDto.prototype, "commitCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '代码行数' }),
    __metadata("design:type", Number)
], TeamProjectDto.prototype, "codeLines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI质量评分' }),
    __metadata("design:type", Object)
], TeamProjectDto.prototype, "aiQualityScore", void 0);
class TeamReportDto {
    teamId;
    teamName;
    leaderName;
    periodType;
    periodValue;
    totalMembers;
    activeMembers;
    totalCommits;
    totalInsertions;
    totalDeletions;
    totalTasks;
    avgQualityScore;
    aiSummary;
    aiRating;
    aiAdvantages;
    aiSuggestions;
    reportGeneratedAt;
    members;
    projects;
}
exports.TeamReportDto = TeamReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组ID' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "teamName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组长姓名' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "leaderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期类型' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '周期值' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "periodValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总成员数' }),
    __metadata("design:type", Number)
], TeamReportDto.prototype, "totalMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '活跃成员数' }),
    __metadata("design:type", Number)
], TeamReportDto.prototype, "activeMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总提交数' }),
    __metadata("design:type", Number)
], TeamReportDto.prototype, "totalCommits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新增行数' }),
    __metadata("design:type", Number)
], TeamReportDto.prototype, "totalInsertions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '删除行数' }),
    __metadata("design:type", Number)
], TeamReportDto.prototype, "totalDeletions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总任务数' }),
    __metadata("design:type", Number)
], TeamReportDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '平均质量分' }),
    __metadata("design:type", Object)
], TeamReportDto.prototype, "avgQualityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI 分析摘要' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "aiSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI 评级' }),
    __metadata("design:type", String)
], TeamReportDto.prototype, "aiRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI 优势分析' }),
    __metadata("design:type", Array)
], TeamReportDto.prototype, "aiAdvantages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AI 改进建议' }),
    __metadata("design:type", Array)
], TeamReportDto.prototype, "aiSuggestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '报告生成时间' }),
    __metadata("design:type", Date)
], TeamReportDto.prototype, "reportGeneratedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '成员详情', type: [TeamMemberDto] }),
    __metadata("design:type", Array)
], TeamReportDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '项目详情', type: [TeamProjectDto] }),
    __metadata("design:type", Array)
], TeamReportDto.prototype, "projects", void 0);
class CreateTeamDto {
    name;
    description;
    leaderName;
    memberNames;
}
exports.CreateTeamDto = CreateTeamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称', example: '运营前端组' }),
    (0, class_validator_1.IsNotEmpty)({ message: '小组名称不能为空' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeamDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组描述', example: '负责运营相关前端项目开发', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeamDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组长姓名', example: '张三', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeamDto.prototype, "leaderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '成员名称列表', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTeamDto.prototype, "memberNames", void 0);
class UpdateTeamDto {
    name;
    description;
    leaderName;
    memberNames;
}
exports.UpdateTeamDto = UpdateTeamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组名称', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeamDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小组描述', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeamDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组长姓名', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeamDto.prototype, "leaderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '成员名称列表', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTeamDto.prototype, "memberNames", void 0);
class TeamDetailDto extends TeamListItemDto {
    leaderId;
    members;
}
exports.TeamDetailDto = TeamDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '组长ID' }),
    __metadata("design:type", Object)
], TeamDetailDto.prototype, "leaderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '成员列表' }),
    __metadata("design:type", Array)
], TeamDetailDto.prototype, "members", void 0);
class TeamMemberSimpleDto {
    id;
    username;
    email;
    isLeader;
}
exports.TeamMemberSimpleDto = TeamMemberSimpleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    __metadata("design:type", String)
], TeamMemberSimpleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    __metadata("design:type", String)
], TeamMemberSimpleDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱' }),
    __metadata("design:type", String)
], TeamMemberSimpleDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否为组长' }),
    __metadata("design:type", Boolean)
], TeamMemberSimpleDto.prototype, "isLeader", void 0);
class CreateMemberDto {
    username;
    email;
    isLeader;
}
exports.CreateMemberDto = CreateMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名', example: 'zhangsan' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱', example: 'zhangsan@example.com' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否为组长', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMemberDto.prototype, "isLeader", void 0);
//# sourceMappingURL=teams.dto.js.map