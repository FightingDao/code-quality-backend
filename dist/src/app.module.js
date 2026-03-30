"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./common/prisma.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const data_module_1 = require("./modules/data/data.module");
const projects_module_1 = require("./modules/projects/projects.module");
const teams_module_1 = require("./modules/teams/teams.module");
const users_module_1 = require("./modules/users/users.module");
const code_review_module_1 = require("./modules/code-review/code-review.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            dashboard_module_1.DashboardModule,
            data_module_1.DataModule,
            projects_module_1.ProjectsModule,
            teams_module_1.TeamsModule,
            users_module_1.UsersModule,
            code_review_module_1.CodeReviewModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map