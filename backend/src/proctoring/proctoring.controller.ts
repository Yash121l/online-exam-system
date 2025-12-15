import { Body, Controller, Post } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ProctoringService } from './proctoring.service';

type StreamPayload = {
  examSessionId: string;
  sequence?: number;
  frameType: 'webcam' | 'screen' | 'audio';
  data: string;
};

@Controller('proctoring')
export class ProctoringController {
  constructor(private readonly logger: Logger, private readonly proctoringService: ProctoringService) {}

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
    void this.proctoringService.ingestEvent({
      examSessionId: payload.examSessionId,
      eventType: `stream.${payload.frameType}`,
      payload: { sequence: payload.sequence, data: payload.data }
    });
    return { received: true, ts: Date.now() };
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
    void this.proctoringService.ingestAnalytics(payload);
    return { received: true, ts: Date.now() };
  }
}
