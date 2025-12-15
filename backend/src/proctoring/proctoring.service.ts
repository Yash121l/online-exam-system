import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProctoringService {
  constructor(private readonly prisma: PrismaService) {}

  ingestEvent(data: { examSessionId: string; eventType: string; payload?: Record<string, unknown> }) {
    return this.prisma.proctoringEvent.create({
      data: {
        examSessionId: data.examSessionId,
        eventType: data.eventType,
        payload: data.payload as Prisma.InputJsonValue
      }
    });
  }

  ingestAnalytics(data: { examSessionId: string; flags: string[] }) {
    return this.prisma.proctoringEvent.create({
      data: {
        examSessionId: data.examSessionId,
        eventType: 'analytics.flags',
        payload: { flags: data.flags } as Prisma.InputJsonValue
      }
    });
  }
}
