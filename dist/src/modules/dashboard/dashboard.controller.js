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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const common_dto_1 = require("../../common/dto/common.dto");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getOverview(dto) {
        return this.dashboardService.getOverview(dto);
    }
    async getTeamDashboards(dto) {
        return this.dashboardService.getTeamDashboards(dto);
    }
    async getCodeAnalysisList(dto) {
        return this.dashboardService.getCodeAnalysisList(dto);
    }
    async getProjectAnalysisList(dto) {
        return this.dashboardService.getProjectAnalysisList(dto);
    }
    async getFilterOptions(dto) {
        return this.dashboardService.getFilterOptions(dto);
    }
    async getPeriods(periodType) {
        return this.dashboardService.getPeriods(periodType);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: '获取大盘统计数据' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('teams'),
    (0, swagger_1.ApiOperation)({ summary: '获取各小组整体分析报告' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTeamDashboards", null);
__decorate([
    (0, common_1.Get)('analyses'),
    (0, swagger_1.ApiOperation)({ summary: '获取代码分析列表（支持筛选和排序）' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCodeAnalysisList", null);
__decorate([
    (0, common_1.Get)('project-analyses'),
    (0, swagger_1.ApiOperation)({ summary: '获取项目维度分析列表（用于项目概览）' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProjectAnalysisList", null);
__decorate([
    (0, common_1.Get)('filter-options'),
    (0, swagger_1.ApiOperation)({ summary: '获取筛选选项数据' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFilterOptions", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: '已有数据的周期列表' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)('periodType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPeriods", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('大盘视图'),
    (0, common_1.Controller)('api/v1/dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map