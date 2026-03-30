export declare class DashboardOverviewDto {
    totalMembers: number;
    totalCommits: number;
    totalTasks: number;
    avgQualityScore: number | null;
}
export declare class TeamDashboardDto {
    id: string;
    name: string;
    totalMembers: number;
    activeMembers: number;
    totalCommits: number;
    insertions: number;
    deletions: number;
    avgQualityScore: number | null;
}
export declare class CodeAnalysisListItemDto {
    id: string;
    userName: string;
    projectName: string;
    commitCount: number;
    insertions: number;
    deletions: number;
    codeLines: number;
    aiQualityScore: number | null;
    taskCount: number;
}
