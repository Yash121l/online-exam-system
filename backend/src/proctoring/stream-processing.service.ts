import { Injectable, Logger } from '@nestjs/common';
import { ProctoringService } from './proctoring.service';
import { MonitoringGateway } from './monitoring.gateway';

export type StreamPayload = {
  examSessionId: string;
  sequence?: number;
  frameType: 'webcam' | 'screen' | 'audio';
  data: string;
};

export type AnalyticsPayload = { examSessionId: string; flags: string[] };

type SessionBuffer = {
  framesProcessed: number;
  lastSequence: number | null;
  flags: string[];
  lastFrameType: StreamPayload['frameType'] | null;
  lastUpdate: number;
};

@Injectable()
export class StreamProcessingService {
  private readonly logger = new Logger(StreamProcessingService.name);
  private readonly buffers = new Map<string, SessionBuffer>();

  constructor(
    private readonly proctoringService: ProctoringService,
    private readonly monitoringGateway: MonitoringGateway
  ) {}

  private getBuffer(sessionId: string): SessionBuffer {
    if (!this.buffers.has(sessionId)) {
      this.buffers.set(sessionId, {
        framesProcessed: 0,
        lastSequence: null,
        flags: [],
        lastFrameType: null,
        lastUpdate: Date.now()
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.buffers.get(sessionId)!;
  }

  async handleStreamFrame(payload: StreamPayload) {
    const buffer = this.getBuffer(payload.examSessionId);
    buffer.framesProcessed += 1;
    buffer.lastFrameType = payload.frameType;
    buffer.lastUpdate = Date.now();

    await this.proctoringService.ingestEvent({
      examSessionId: payload.examSessionId,
      eventType: `stream.${payload.frameType}`,
      payload: { sequence: payload.sequence, data: payload.data }
    });

    const newFlags = this.analyzeFrame(payload, buffer);
    if (newFlags.length) {
      buffer.flags.push(...newFlags);
      await this.proctoringService.ingestAnalytics({ examSessionId: payload.examSessionId, flags: newFlags });
      this.monitoringGateway.emitFlag({
        examSessionId: payload.examSessionId,
        flags: newFlags,
        at: Date.now()
      });
    }

    if (buffer.framesProcessed % 10 === 0) {
      await this.persistSummary(payload.examSessionId, buffer);
    }

    this.monitoringGateway.emitTileUpdate({
      examSessionId: payload.examSessionId,
      lastFrameType: payload.frameType,
      flags: buffer.flags.slice(-5),
      framesProcessed: buffer.framesProcessed,
      lastUpdate: buffer.lastUpdate
    });
  }

  async handleAnalytics(payload: AnalyticsPayload) {
    await this.proctoringService.ingestAnalytics(payload);
    this.monitoringGateway.emitFlag({ examSessionId: payload.examSessionId, flags: payload.flags, at: Date.now() });
  }

  private analyzeFrame(payload: StreamPayload, buffer: SessionBuffer): string[] {
    const flags: string[] = [];

    if (payload.sequence !== undefined && buffer.lastSequence !== null && payload.sequence > buffer.lastSequence + 1) {
      flags.push('stream.gap');
    }
    buffer.lastSequence = payload.sequence ?? buffer.lastSequence;

    if (payload.frameType === 'audio' && payload.data.length < 12) {
      flags.push('audio.silence');
    }
    if ((payload.frameType === 'screen' || payload.frameType === 'webcam') && payload.data.length < 20) {
      flags.push('video.low_fidelity');
    }

    return flags;
  }

  private async persistSummary(sessionId: string, buffer: SessionBuffer) {
    const summary = {
      framesProcessed: buffer.framesProcessed,
      lastFrameType: buffer.lastFrameType,
      flags: buffer.flags.slice(-10),
      lastUpdate: buffer.lastUpdate
    };
    this.logger.log({ sessionId, summary }, 'Persisting proctoring summary');
    await this.proctoringService.ingestSummary({ examSessionId: sessionId, summary });
    this.monitoringGateway.emitSummary({ examSessionId: sessionId, summary });
  }
}
