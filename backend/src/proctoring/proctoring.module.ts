import { Module } from '@nestjs/common';
import { ProctoringGateway } from './proctoring.gateway';
import { ProctoringController } from './proctoring.controller';
import { ProctoringService } from './proctoring.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  providers: [ProctoringGateway, ProctoringService],
  controllers: [ProctoringController],
  exports: [ProctoringService]
})
export class ProctoringModule {}
