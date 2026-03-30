import { PrismaService } from '../../common/prisma.service';
export declare class CodeReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    resolveProjectId(projectIdOrName: string): Promise<string | null>;
    saveIssues(analysisId: string, issues: any[]): Promise<{
        count: number;
    }>;
    getProjectIssues(projectId: string, periodType: string, periodValue: string): Promise<any>;
    getProjectReviewSummary(projectId: string, periodType: string, periodValue: string): Promise<{
        stats: any;
        typeStats: any;
        fileStats: any;
    }>;
    saveReviewReport(projectId: string, periodType: string, periodValue: string, report: {
        overview: any;
        issues: any[];
        commonIssues: any[];
        highlights: any[];
        priority: any[];
    }): Promise<{
        success: boolean;
        message: string;
        issueCount?: undefined;
    } | {
        success: boolean;
        issueCount: number;
        message?: undefined;
    }>;
}
