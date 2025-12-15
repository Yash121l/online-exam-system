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

  ingestSummary(data: { examSessionId: string; summary: Record<string, unknown> }) {
    return this.prisma.proctoringEvent.create({
      data: {
        examSessionId: data.examSessionId,
        eventType: 'analytics.summary',
        payload: data.summary as Prisma.InputJsonValue
      }
    });
  }

  async getRecentFlags(examSessionId: string) {
    const rows = await this.prisma.proctoringEvent.findMany({
      where: { examSessionId, eventType: 'analytics.flags' },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      flags: (row.payload as { flags?: string[] })?.flags ?? []
    }));
  }

  async getLatestSummary(examSessionId: string) {
    const row = await this.prisma.proctoringEvent.findFirst({
      where: { examSessionId, eventType: 'analytics.summary' },
      orderBy: { createdAt: 'desc' }
    });

    if (!row) return null;
    return {
      id: row.id,
      createdAt: row.createdAt,
      summary: row.payload ?? {}
    };
  }
}
