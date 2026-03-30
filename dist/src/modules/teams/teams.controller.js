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
exports.TeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teams_service_1 = require("./teams.service");
const common_dto_1 = require("../../common/dto/common.dto");
const teams_dto_1 = require("./dto/teams.dto");
let TeamsController = class TeamsController {
    teamsService;
    constructor(teamsService) {
        this.teamsService = teamsService;
    }
    async getTeamList() {
        return this.teamsService.getTeamList();
    }
    async getAvailableUsers() {
        return this.teamsService.getAvailableUsers();
    }
    async getUserNames() {
        return this.teamsService.getUserNames();
    }
    async createTeam(dto) {
        try {
            return await this.teamsService.createTeam(dto);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw error;
        }
    }
    async getTeamDetail(id) {
        try {
            return await this.teamsService.getTeamDetail(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw error;
        }
    }
    async updateTeam(id, dto) {
        try {
            return await this.teamsService.updateTeam(id, dto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw error;
        }
    }
    async deleteTeam(id) {
        try {
            return await this.teamsService.deleteTeam(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw error;
        }
    }
    async addMember(id, username, email, isLeader) {
        try {
            return await this.teamsService.addMember(id, username, email, isLeader);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw error;
        }
    }
    async removeMember(id, userId) {
        try {
            return await this.teamsService.removeMember(id, userId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw error;
        }
    }
    async getTeamReport(id, dto) {
        try {
            return await this.teamsService.getTeamReport(id, dto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw error;
        }
    }
};
exports.TeamsController = TeamsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取小组列表' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getTeamList", null);
__decorate([
    (0, common_1.Get)('available-users'),
    (0, swagger_1.ApiOperation)({ summary: '获取可用用户列表（未分配小组的）' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getAvailableUsers", null);
__decorate([
    (0, common_1.Get)('user-names'),
    (0, swagger_1.ApiOperation)({ summary: '获取所有小组成员的用户名列表（用于Git提交匹配）' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getUserNames", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建小组' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '创建成功' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: '小组名称已存在' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teams_dto_1.CreateTeamDto]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取小组详情' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '小组不存在' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getTeamDetail", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '更新小组' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '更新成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '小组不存在' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: '小组名称已存在' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teams_dto_1.UpdateTeamDto]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "updateTeam", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '删除小组' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '删除成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '小组不存在' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "deleteTeam", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: '为小组添加成员' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '添加成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '小组不存在' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('isLeader')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, swagger_1.ApiOperation)({ summary: '从小组移除成员' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '移除成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '用户不在该小组中' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    (0, swagger_1.ApiOperation)({ summary: '获取小组报告' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '小组不存在' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, common_dto_1.PeriodQueryDto]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getTeamReport", null);
exports.TeamsController = TeamsController = __decorate([
    (0, swagger_1.ApiTags)('小组管理'),
    (0, common_1.Controller)('api/v1/teams'),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], TeamsController);
//# sourceMappingURL=teams.controller.js.map