import { PrismaService } from '../../common/prisma.service';
import { BatchCreateCodeAnalysisDto, BatchSyncUsersDto, CalculateStatisticsDto } from './dto/data.dto';
export declare class DataService {
    private prisma;
    constructor(prisma: PrismaService);
    batchCreateAnalyses(dto: BatchCreateCodeAnalysisDto): Promise<{
        success: boolean;
        data: {
            count: number;
            message: string;
        };
    }>;
    batchSyncUsers(dto: BatchSyncUsersDto): Promise<{
        success: boolean;
        data: {
            created: number;
            updated: number;
            total: number;
            message: string;
        };
    }>;
    calculateStatistics(dto: CalculateStatisticsDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    private calculateProjectStatistics;
    private calculateTeamStatistics;
    private calculateAverageScore;
}
