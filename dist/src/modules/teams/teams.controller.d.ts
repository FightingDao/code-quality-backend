import { TeamsService } from './teams.service';
import { PeriodQueryDto } from '../../common/dto/common.dto';
import { CreateTeamDto, UpdateTeamDto } from './dto/teams.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    getTeamList(): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamListItemDto[];
    }>;
    getAvailableUsers(): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamMemberSimpleDto[];
    }>;
    getUserNames(): Promise<{
        success: boolean;
        data: string[];
    }>;
    createTeam(dto: CreateTeamDto): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamDetailDto;
    }>;
    getTeamDetail(id: string): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamDetailDto;
    }>;
    updateTeam(id: string, dto: UpdateTeamDto): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamDetailDto;
    }>;
    deleteTeam(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addMember(id: string, username: string, email?: string, isLeader?: boolean): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamMemberSimpleDto;
    }>;
    removeMember(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTeamReport(id: string, dto: PeriodQueryDto): Promise<{
        success: boolean;
        data: import("./dto/teams.dto").TeamReportDto;
    }>;
}
