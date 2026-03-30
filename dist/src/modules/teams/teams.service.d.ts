import { PrismaService } from '../../common/prisma.service';
import { TeamListItemDto, TeamDetailDto, TeamReportDto, CreateTeamDto, UpdateTeamDto, TeamMemberSimpleDto } from './dto/teams.dto';
import { PeriodQueryDto } from '../../common/dto/common.dto';
export declare class TeamsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTeamList(): Promise<{
        success: boolean;
        data: TeamListItemDto[];
    }>;
    getUserNames(): Promise<{
        success: boolean;
        data: string[];
    }>;
    getTeamDetail(id: string): Promise<{
        success: boolean;
        data: TeamDetailDto;
    }>;
    createTeam(dto: CreateTeamDto): Promise<{
        success: boolean;
        data: TeamDetailDto;
    }>;
    updateTeam(teamId: string, dto: UpdateTeamDto): Promise<{
        success: boolean;
        data: TeamDetailDto;
    }>;
    private getTeamDetailWithTx;
    deleteTeam(teamId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAvailableUsers(): Promise<{
        success: boolean;
        data: TeamMemberSimpleDto[];
    }>;
    addMember(teamId: string, username: string, email?: string, isLeader?: boolean): Promise<{
        success: boolean;
        data: TeamMemberSimpleDto;
    }>;
    removeMember(teamId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTeamReport(teamId: string, dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: TeamReportDto;
    }>;
    private getCurrentPeriodValue;
    private calculateAverageScore;
}
