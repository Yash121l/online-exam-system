import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ProctoringService } from './proctoring.service';
import { StreamProcessingService, StreamPayload } from './stream-processing.service';

@Controller('proctoring')
export class ProctoringController {
  constructor(
    private readonly logger: Logger,
    private readonly proctoringService: ProctoringService,
    private readonly streamProcessingService: StreamProcessingService
  ) {}

  @Post('ingest/frame')
  ingestFrame(@Body() payload: StreamPayload) {
    this.logger.log(
      {
        examSessionId: payload.examSessionId,
        frameType: payload.frameType,
        sequence: payload.sequence
      },
      'Proctoring frame ingested'
    );
    void this.streamProcessingService.handleStreamFrame(payload);
    return { received: true, ts: Date.now(), queued: true };
  }

  @Post('ingest/analytics')
  ingestAnalytics(@Body() payload: { examSessionId: string; flags: string[] }) {
    this.logger.warn(
      {
        examSessionId: payload.examSessionId,
        flags: payload.flags
      },
      'Analytics flags received'
    );
    void this.streamProcessingService.handleAnalytics(payload);
    return { received: true, ts: Date.now(), queued: true };
  }

  @Get('sessions/:examSessionId/flags')
  listFlags(@Param('examSessionId') examSessionId: string) {
    return this.proctoringService.getRecentFlags(examSessionId);
  }

  @Get('sessions/:examSessionId/summary')
  getSummary(@Param('examSessionId') examSessionId: string) {
    return this.proctoringService.getLatestSummary(examSessionId);
  }
}
