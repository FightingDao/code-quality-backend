import { UsersService } from './users.service';
import { UserAnalysisQueryDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserAnalysis(id: string, dto: UserAnalysisQueryDto): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                username: string;
                email: string;
                avatar: string | null;
                teamId: string | null;
                teamName: string | undefined;
                gitUsername: string | null;
                gitEmail: string | null;
                reportTime: Date;
            };
            statistics: {
                totalCommits: number;
                totalInsertions: number;
                totalDeletions: number;
                netGrowth: number;
                totalCodeLines: number;
                totalTasks: number;
                avgQualityScore: number | null;
            };
            report: {
                projectId: string | null;
                projectName: string | null;
                branch: string;
                currentVersion: string;
                compareVersion: string;
                commitCount: number;
                issues: string[];
                suggestions: string[];
                advantages: string[];
                overallEvaluation: string;
                commitTypes: Record<string, number>;
                fileChanges: {
                    path: string;
                    insertions: number;
                    deletions: number;
                    type: string;
                }[];
            };
            projects: {
                id: string;
                name: string;
                commitCount: number;
                insertions: number;
                deletions: number;
                aiQualityScore: number | null;
            }[];
            commits: {
                hash: string;
                message: string;
                type: string;
                time: string | null;
                insertions: number;
                deletions: number;
                projectName: string | null;
            }[];
            meta: {
                total: number;
                page: number;
                limit: number;
                hasMore: boolean;
            };
        };
    }>;
}
