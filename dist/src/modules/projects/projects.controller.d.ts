import { ProjectsService } from './projects.service';
import { ProjectListQueryDto, ProjectReportQueryDto } from './dto/projects.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getProjectList(dto: ProjectListQueryDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            repository: string;
            description: string | null;
            teamId: string | null;
            teamName: string | undefined;
            techStack: import(".prisma/client").Prisma.JsonValue;
            isActive: boolean;
            defaultBranch: string | null;
            lastCommitAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            hasMore: boolean;
        };
    }>;
    getProjectInfo(id: string): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            repository: any;
            description: any;
            teamId: any;
            teamName: any;
            techStack: any;
            isActive: any;
            defaultBranch: any;
            lastCommitAt: any;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    getProjectReport(id: string, dto: ProjectReportQueryDto): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            repository: any;
            description: any;
            teamId: any;
            teamName: any;
            techStack: any;
            isActive: any;
            defaultBranch: any;
            lastCommitAt: any;
            periodType: "week" | "month" | "quarter";
            periodValue: string;
            totalContributors: number;
            totalCommits: number;
            totalInsertions: number;
            totalDeletions: number;
            totalTasks: number;
            totalLines: number;
            avgQualityScore: number | null;
            aiRating: string;
            aiAdvantages: string[];
            aiSuggestions: string[];
            aiCommonIssues: string[];
            aiBestPractices: string[];
            currentVersion: string;
            compareVersion: string;
            reportGeneratedAt: Date;
            members: {
                id: string;
                username: string;
                commitCount: number;
                commitRatio: string;
                insertions: number;
                deletions: number;
                netLines: number;
                mustFixCount: number;
                suggestCount: number;
                issueCount: number;
                issueRatio: string;
                qualityRating: string;
                fileChanges: string | number | true | import(".prisma/client").Prisma.JsonObject | import(".prisma/client").Prisma.JsonArray;
                aiQualityScore: import("@prisma/client/runtime/library").Decimal | null;
                aiQualityReport: string | null;
            }[];
        };
    }>;
}
