import { Module } from '@nestjs/common';
import { ProctoringGateway } from './proctoring.gateway';
import { ProctoringController } from './proctoring.controller';
import { ProctoringService } from './proctoring.service';
import { LogsModule } from '../logs/logs.module';
import { MonitoringGateway } from './monitoring.gateway';
import { StreamProcessingService } from './stream-processing.service';

@Module({
  imports: [LogsModule],
  providers: [ProctoringGateway, ProctoringService, MonitoringGateway, StreamProcessingService],
  controllers: [ProctoringController],
  exports: [ProctoringService, StreamProcessingService]
})
export class ProctoringModule {}
