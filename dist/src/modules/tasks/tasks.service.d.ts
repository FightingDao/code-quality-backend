import { PrismaService } from '../../common/prisma.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private resolvePeriod;
    private getCurrentPeriodValue;
    getOverview(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            periodType: "week" | "month" | "quarter";
            periodValue: string;
            kpi: {
                total: number;
                high: number;
                medium: number;
                low: number;
                avgScore: number;
                highRate: number;
            };
        };
    }>;
    getDistribution(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            difficultyDistribution: {
                level: string;
                count: number;
            }[];
            avgDimensions: {
                dimension: string;
                score: number;
            }[];
        };
    }>;
    getList(dto: PeriodQueryDto & {
        difficulty?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: {
            items: {
                totalScore: number;
                scoreScale: number;
                scoreComplexity: number;
                scoreIssueDensity: number;
                scoreAi: number;
                scoreCrossModule: number;
                rawAvgAiScore: number | null;
                id: string;
                taskNo: string;
                projectNames: import(".prisma/client").Prisma.JsonValue;
                committers: import(".prisma/client").Prisma.JsonValue;
                difficultyLevel: string;
                rawLoc: number;
                rawCommitCount: number;
                rawIssueCount: number;
                rawModuleCount: number;
            }[];
            meta: {
                total: number;
                page: number;
                limit: number;
            };
        };
    }>;
    getPeriods(periodType?: string): Promise<{
        success: boolean;
        data: string[];
    }>;
}
