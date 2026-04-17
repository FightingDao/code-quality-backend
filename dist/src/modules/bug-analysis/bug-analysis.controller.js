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
exports.BugAnalysisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bug_analysis_service_1 = require("./bug-analysis.service");
const common_dto_1 = require("../../common/dto/common.dto");
let BugAnalysisController = class BugAnalysisController {
    bugAnalysisService;
    constructor(bugAnalysisService) {
        this.bugAnalysisService = bugAnalysisService;
    }
    async getOverview(dto) {
        return this.bugAnalysisService.getOverview(dto);
    }
    async getByPerson(dto) {
        return this.bugAnalysisService.getByPerson(dto);
    }
    async getTrend(dto) {
        return this.bugAnalysisService.getTrend(dto);
    }
    async getInsights(dto) {
        return this.bugAnalysisService.getInsights(dto);
    }
    async getList(dto) {
        return this.bugAnalysisService.getList(dto);
    }
    async getDetail(bugNo) {
        return this.bugAnalysisService.getDetail(bugNo);
    }
    async getCodeChanges(bugNo) {
        return this.bugAnalysisService.getCodeChanges(bugNo);
    }
    async getPeriods(periodType) {
        return this.bugAnalysisService.getPeriods(periodType);
    }
};
exports.BugAnalysisController = BugAnalysisController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: '获取 Bug 分析大盘概览（KPI + 分布统计）' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('by-person'),
    (0, swagger_1.ApiOperation)({ summary: '按修复人统计 bug 数据' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getByPerson", null);
__decorate([
    (0, common_1.Get)('trend'),
    (0, swagger_1.ApiOperation)({ summary: '跨周期缺陷趋势（最近 N 个周期）' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getTrend", null);
__decorate([
    (0, common_1.Get)('insights'),
    (0, swagger_1.ApiOperation)({ summary: '获取 AI 洞察报告' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getInsights", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'Bug 明细列表（支持筛选分页）' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('detail'),
    (0, swagger_1.ApiOperation)({ summary: '获取单个 Bug 详情' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)('bugNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getDetail", null);
__decorate([
    (0, common_1.Get)('code-changes'),
    (0, swagger_1.ApiOperation)({ summary: '获取 Bug 关联的代码变更（git diff）' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)('bugNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getCodeChanges", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: '获取已有数据的周期列表' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)('periodType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BugAnalysisController.prototype, "getPeriods", null);
exports.BugAnalysisController = BugAnalysisController = __decorate([
    (0, swagger_1.ApiTags)('Bug 分析'),
    (0, common_1.Controller)('api/v1/bugs'),
    __metadata("design:paramtypes", [bug_analysis_service_1.BugAnalysisService])
], BugAnalysisController);
//# sourceMappingURL=bug-analysis.controller.js.map