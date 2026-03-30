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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const projects_dto_1 = require("./dto/projects.dto");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async getProjectList(dto) {
        return this.projectsService.getProjectList(dto);
    }
    async getProjectInfo(id) {
        return this.projectsService.getProjectInfo(id);
    }
    async getProjectReport(id, dto) {
        return this.projectsService.getProjectReport(id, dto);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取项目列表' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [projects_dto_1.ProjectListQueryDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjectList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取项目信息' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '项目不存在' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjectInfo", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    (0, swagger_1.ApiOperation)({ summary: '获取项目报告' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '项目不存在' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, projects_dto_1.ProjectReportQueryDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjectReport", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('项目管理'),
    (0, common_1.Controller)('api/v1/projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map