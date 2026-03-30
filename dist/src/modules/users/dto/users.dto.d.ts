export declare class UserAnalysisQueryDto {
    periodType?: 'week' | 'month' | 'quarter';
    periodValue?: string;
    projectId?: string;
    page?: number;
    limit?: number;
}
export declare class UserBasicInfoDto {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    teamId?: string;
    teamName?: string;
    gitUsername?: string;
    gitEmail?: string;
}
export declare class UserStatisticsDto {
    totalCommits: number;
    totalInsertions: number;
    totalDeletions: number;
    totalCodeLines: number;
    totalTasks: number;
    avgQualityScore: number | null;
}
export declare class CodeAnalysisItemDto {
    id: string;
    projectId: string;
    projectName: string;
    periodType: string;
    periodValue: string;
    commitCount: number;
    insertions: number;
    deletions: number;
    codeLines: number;
    aiQualityScore: number | null;
    taskCount: number;
    createdAt: Date;
}
export declare class UserAnalysisDto {
    user: UserBasicInfoDto;
    statistics: UserStatisticsDto;
    analyses: CodeAnalysisItemDto[];
    meta: {
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
}
