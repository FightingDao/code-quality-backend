"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeReviewModule = void 0;
const common_1 = require("@nestjs/common");
const code_review_controller_1 = require("./code-review.controller");
const code_review_service_1 = require("./code-review.service");
const prisma_module_1 = require("../../common/prisma.module");
let CodeReviewModule = class CodeReviewModule {
};
exports.CodeReviewModule = CodeReviewModule;
exports.CodeReviewModule = CodeReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [code_review_controller_1.CodeReviewController],
        providers: [code_review_service_1.CodeReviewService],
        exports: [code_review_service_1.CodeReviewService]
    })
], CodeReviewModule);
//# sourceMappingURL=code-review.module.js.map