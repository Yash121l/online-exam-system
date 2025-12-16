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
        sessionId: payload.sessionId,
        frameType: payload.frameType,
        sequence: payload.sequence
      },
      'Proctoring frame ingested'
    );
    void this.streamProcessingService.handleStreamFrame(payload);
    return { received: true, ts: Date.now(), queued: true };
  }

  @Post('ingest/analytics')
  ingestAnalytics(@Body() payload: { sessionId: string; flags: string[] }) {
    this.logger.warn(
      {
        sessionId: payload.sessionId,
        flags: payload.flags
      },
      'Analytics flags received'
    );
    void this.streamProcessingService.handleAnalytics({ sessionId: payload.sessionId, flags: payload.flags });
    return { received: true, ts: Date.now(), queued: true };
  }

  @Get('sessions/:sessionId/flags')
  listFlags(@Param('sessionId') sessionId: string) {
    return this.proctoringService.getRecentFlags(sessionId);
  }

  @Get('sessions/:sessionId/summary')
  getSummary(@Param('sessionId') sessionId: string) {
    return this.proctoringService.getLatestSummary(sessionId);
  }
}
