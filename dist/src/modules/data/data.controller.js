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
exports.DataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const data_service_1 = require("./data.service");
const data_dto_1 = require("./dto/data.dto");
let DataController = class DataController {
    dataService;
    constructor(dataService) {
        this.dataService = dataService;
    }
    async batchCreateAnalyses(dto) {
        return this.dataService.batchCreateAnalyses(dto);
    }
    async batchSyncUsers(dto) {
        return this.dataService.batchSyncUsers(dto);
    }
    async calculateStatistics(dto) {
        return this.dataService.calculateStatistics(dto);
    }
};
exports.DataController = DataController;
__decorate([
    (0, common_1.Post)('analyses'),
    (0, swagger_1.ApiOperation)({ summary: '批量写入代码分析数据' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '创建成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_dto_1.BatchCreateCodeAnalysisDto]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "batchCreateAnalyses", null);
__decorate([
    (0, common_1.Post)('sync-users'),
    (0, swagger_1.ApiOperation)({ summary: '批量同步用户信息' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '同步成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_dto_1.BatchSyncUsersDto]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "batchSyncUsers", null);
__decorate([
    (0, common_1.Post)('calculate-statistics'),
    (0, swagger_1.ApiOperation)({ summary: '触发统计计算' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '计算成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_dto_1.CalculateStatisticsDto]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "calculateStatistics", null);
exports.DataController = DataController = __decorate([
    (0, swagger_1.ApiTags)('数据写入（小龙虾专用）'),
    (0, common_1.Controller)('api/v1/data'),
    __metadata("design:paramtypes", [data_service_1.DataService])
], DataController);
//# sourceMappingURL=data.controller.js.map