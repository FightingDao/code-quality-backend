export declare class CreateCodeAnalysisDto {
    userId: string;
    projectId: string;
    periodType: 'week' | 'month';
    periodValue: string;
    commitCount: number;
    insertions: number;
    deletions: number;
    filesChanged: number;
    totalLines: number;
    codeLines: number;
    commentLines: number;
    blankLines: number;
    languages?: Record<string, number>;
    fileChanges?: any[];
    aiQualityScore?: number;
    aiQualityReport?: string;
    taskCount?: number;
}
export declare class BatchCreateCodeAnalysisDto {
    analyses: CreateCodeAnalysisDto[];
}
export declare class SyncUserDto {
    username: string;
    email: string;
    avatar?: string;
    teamId?: string;
    gitUsername?: string;
    gitEmail?: string;
}
export declare class BatchSyncUsersDto {
    users: SyncUserDto[];
}
export declare class CalculateStatisticsDto {
    periodType: 'week' | 'month';
    periodValue: string;
    teamId?: string;
    projectId?: string;
}
