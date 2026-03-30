export declare class TeamListItemDto {
    id: string;
    name: string;
    description: string | null;
    leaderName: string | null;
    memberCount: number;
    projectCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TeamMemberDto {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    commitCount: number;
    insertions: number;
    deletions: number;
    codeLines: number;
    aiQualityScore: number | null;
    taskCount: number;
}
export declare class TeamProjectDto {
    id: string;
    name: string;
    repository: string;
    techStack: Record<string, any> | null;
    contributorCount: number;
    commitCount: number;
    codeLines: number;
    aiQualityScore: number | null;
}
export declare class TeamReportDto {
    teamId: string;
    teamName: string;
    leaderName: string;
    periodType: string;
    periodValue: string;
    totalMembers: number;
    activeMembers: number;
    totalCommits: number;
    totalInsertions: number;
    totalDeletions: number;
    totalTasks: number;
    avgQualityScore: number | null;
    aiSummary: string;
    aiRating: string;
    aiAdvantages: string[];
    aiSuggestions: string[];
    reportGeneratedAt: Date;
    members: TeamMemberDto[];
    projects: TeamProjectDto[];
}
export declare class CreateTeamDto {
    name: string;
    description?: string;
    leaderName?: string;
    memberNames?: string[];
}
export declare class UpdateTeamDto {
    name?: string;
    description?: string;
    leaderName?: string;
    memberNames?: string[];
}
export declare class TeamDetailDto extends TeamListItemDto {
    leaderId: string | null;
    members: TeamMemberSimpleDto[];
}
export declare class TeamMemberSimpleDto {
    id: string;
    username: string;
    email: string;
    isLeader: boolean;
}
export declare class CreateMemberDto {
    username: string;
    email: string;
    isLeader?: boolean;
}
