export declare class ProjectListQueryDto {
    page?: number;
    limit?: number;
    teamId?: string;
    isActive?: boolean;
}
export declare class ProjectReportQueryDto {
    periodType?: 'week' | 'month' | 'quarter';
    periodValue?: string;
}
export declare class ProjectListItemDto {
    id: string;
    name: string;
    repository: string;
    description?: string;
    teamId?: string;
    teamName?: string;
    techStack?: any;
    isActive: boolean;
    defaultBranch?: string;
    lastCommitAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProjectReportDto {
    id: string;
    name: string;
    repository: string;
    description?: string;
    teamId?: string;
    teamName?: string;
    techStack?: any;
    isActive: boolean;
    defaultBranch?: string;
    lastCommitAt?: Date;
    periodType: string;
    periodValue: string;
    totalContributors: number;
    totalCommits: number;
    totalInsertions: number;
    totalDeletions: number;
    totalTasks: number;
    totalLines: number;
    avgQualityScore?: number;
}
