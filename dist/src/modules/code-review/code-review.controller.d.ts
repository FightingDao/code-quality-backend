import { CodeReviewService } from './code-review.service';
export declare class CodeReviewController {
    private readonly codeReviewService;
    constructor(codeReviewService: CodeReviewService);
    getProjectIssues(projectId: string, periodType: string, periodValue: string): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            issues: any;
            summary: {
                stats: any;
                typeStats: any;
                fileStats: any;
            };
        };
        error?: undefined;
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
    getSummary(projectId: string, periodType: string, periodValue: string): Promise<{
        success: boolean;
        data: {
            stats: any;
            typeStats: any;
            fileStats: any;
        };
    }>;
}
