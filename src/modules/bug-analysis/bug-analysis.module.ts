import { Module } from '@nestjs/common';
import { BugAnalysisController } from './bug-analysis.controller';
import { BugAnalysisService } from './bug-analysis.service';

@Module({
  controllers: [BugAnalysisController],
  providers: [BugAnalysisService],
})
export class BugAnalysisModule {}
