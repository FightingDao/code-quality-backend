import { BugAnalysisService } from './bug-analysis.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';
export declare class BugAnalysisController {
    private readonly bugAnalysisService;
    constructor(bugAnalysisService: BugAnalysisService);
    getOverview(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            periodType: "week" | "month" | "quarter";
            periodValue: string;
            kpi: {
                totalBugs: number;
                passedBugs: number;
                passRate: number;
                criticalAndSevere: number;
                criticalRate: number;
                fixerCount: number;
            };
            severityDistribution: {
                severity: string;
                count: number;
            }[];
            phaseDistribution: {
                phase: string;
                count: number;
            }[];
            typeDistribution: {
                type: string;
                count: number;
            }[];
            trendSummary: string | null;
        };
    }>;
    getByPerson(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            username: string;
            totalBugs: number;
            criticalBugs: number;
            severeBugs: number;
            normalBugs: number;
            minorBugs: number;
            avgFixTimes: number;
            avgHandOffsTimes: number;
            bugTypeDistribution: import(".prisma/client").Prisma.JsonValue;
            phaseDistribution: import(".prisma/client").Prisma.JsonValue;
        }[];
    }>;
    getTrend(dto: PeriodQueryDto & {
        limit?: number;
    }): Promise<{
        success: boolean;
        data: {
            periodValue: string;
            totalBugs: number;
            criticalAndSevere: number;
            normal: number;
            minor: number;
        }[];
    }>;
    getInsights(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            hasData: boolean;
            periodType: "week" | "month" | "quarter";
            periodValue: string;
            trendSummary?: undefined;
            topIssueTypes?: undefined;
            highRiskPersons?: undefined;
            phaseAnalysis?: undefined;
            aiInsights?: undefined;
            aiSuggestions?: undefined;
        };
    } | {
        success: boolean;
        data: {
            hasData: boolean;
            periodType: "week" | "month" | "quarter";
            periodValue: string;
            trendSummary: string | null;
            topIssueTypes: import(".prisma/client").Prisma.JsonValue;
            highRiskPersons: import(".prisma/client").Prisma.JsonValue;
            phaseAnalysis: import(".prisma/client").Prisma.JsonValue;
            aiInsights: string | null;
            aiSuggestions: import(".prisma/client").Prisma.JsonValue;
        };
    }>;
    getList(dto: PeriodQueryDto & {
        page?: number;
        limit?: number;
        severity?: string;
        fixPerson?: string;
        bugStatus?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            bugNo: string;
            bugName: string;
            severity: string;
            bugStatus: string;
            bugFoundPhase: string | null;
            bugTypeNew: import(".prisma/client").Prisma.JsonValue;
            subsystem: import(".prisma/client").Prisma.JsonValue;
            sprintName: string | null;
            fixPerson: string | null;
            reporter: string | null;
            dateCreated: Date | null;
            fixTimes: number;
            handOffsTimes: number;
            committerName: string | null;
            projectName: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getDetail(bugNo: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            bugNo: string;
            bugName: string;
            severity: string;
            bugStatus: string;
            bugFoundPhase: string | null;
            bugTypeNew: import(".prisma/client").Prisma.JsonValue | null;
            subsystem: import(".prisma/client").Prisma.JsonValue | null;
            sprintId: number | null;
            sprintName: string | null;
            fixPerson: string | null;
            reporter: string | null;
            createdBy: string | null;
            dateCreated: Date | null;
            dateUpdated: Date | null;
            fixTimes: number;
            handOffsTimes: number;
            linkedGroupNoDisplay: string | null;
            commitHash: string | null;
            committerName: string | null;
            projectName: string | null;
            periodType: string;
            periodValue: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message?: undefined;
    }>;
    getCodeChanges(bugNo: string): Promise<{
        success: boolean;
        data: {
            commitHash: string;
            commitMessage: string;
            committerName: string;
            commitDate: string | null;
            projectName: string;
            diff: string;
        }[];
    }>;
    getPeriods(periodType?: string): Promise<{
        success: boolean;
        data: {
            periodType: string;
            periodValue: string;
            totalBugs: number;
        }[];
    }>;
}
