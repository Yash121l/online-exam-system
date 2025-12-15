import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { SocketLogService } from './socket-log.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, SocketLogService],
  exports: [SocketLogService]
})
export class LogsModule {}
