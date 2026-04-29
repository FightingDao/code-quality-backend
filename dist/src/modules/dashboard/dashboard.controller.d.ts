import { DashboardService } from './dashboard.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            totalMembers: number;
            totalCommits: number;
            totalTasks: number;
            avgQualityScore: number | null;
        };
    }>;
    getTeamDashboards(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            leader: string | null;
            totalMembers: number;
            activeMembers: number;
            totalCommits: number;
            totalTasks: number;
            insertions: number;
            deletions: number;
            avgQualityScore: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    }>;
    getCodeAnalysisList(dto: PeriodQueryDto & {
        page?: number;
        limit?: number;
        teamId?: string;
        projectId?: string;
        userName?: string;
        version?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            userName: string;
            userId: string;
            teamName: string;
            teamId: string;
            projectName: string;
            projectIds: string[];
            projectId: string;
            insertions: number;
            deletions: number;
            commitCount: number;
            totalTasks: number;
            aiQualityScore: string | null;
            qualityLevel: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            hasMore: boolean;
        };
    }>;
    getProjectAnalysisList(dto: PeriodQueryDto & {
        page?: number;
        limit?: number;
        projectId?: string;
        version?: string;
        userName?: string;
    }): Promise<{
        success: boolean;
        data: {
            projectId: string;
            projectName: string;
            branch: string;
            compareVersion: string;
            commitCount: number;
            insertions: number;
            deletions: number;
            contributors: {
                userId: string;
                userName: string;
            }[];
            id: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            hasMore: boolean;
        };
    }>;
    getFilterOptions(dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: {
            teams: any[];
            projects: any[];
            users: any[];
            versions: {
                value: string;
                label: string;
            }[];
        };
    }>;
    getPeriods(periodType?: string): Promise<{
        success: boolean;
        data: string[];
    }>;
}
