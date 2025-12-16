import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProctorEventType, ProctorSeverity } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProctoringService {
  constructor(private readonly prisma: PrismaService) {}

  async ingestEvent(data: {
    sessionId: string;
    eventType: ProctorEventType;
    severity?: ProctorSeverity;
    description?: string;
    metadata?: Record<string, unknown>;
    snapshotUrl?: string;
    aiConfidence?: number;
  }) {
    await this.ensureSessionExists(data.sessionId);
    return this.prisma.proctorEvent.create({
      data: {
        sessionId: data.sessionId,
        eventType: data.eventType,
        severity: data.severity ?? ProctorSeverity.MEDIUM,
        description: data.description,
        metadata: data.metadata as Prisma.InputJsonValue,
        snapshotUrl: data.snapshotUrl,
        aiConfidence: data.aiConfidence
      }
    });
  }

  async ingestAnalytics(data: { sessionId: string; flags: string[] }) {
    await this.ensureSessionExists(data.sessionId);
    await this.prisma.proctoringSessions.update({
      where: { id: data.sessionId },
      data: {
        totalFlags: { increment: data.flags.length },
        criticalFlags: {
          increment: data.flags.filter((flag) => flag.toLowerCase().includes('critical')).length
        }
      }
    });
    return this.prisma.proctorEvent.create({
      data: {
        sessionId: data.sessionId,
        eventType: ProctorEventType.SUSPICIOUS_ACTIVITY,
        severity: ProctorSeverity.MEDIUM,
        metadata: { flags: data.flags } as Prisma.InputJsonValue
      }
    });
  }

  async ingestSummary(data: { sessionId: string; summary: Record<string, unknown> }) {
    await this.ensureSessionExists(data.sessionId);
    const riskScore =
      typeof data.summary?.['riskScore'] === 'number'
        ? (data.summary as { riskScore?: number }).riskScore
        : undefined;

    await this.prisma.proctoringSessions.update({
      where: { id: data.sessionId },
      data: {
        overallRiskScore: riskScore,
        totalFlags: (data.summary as { totalFlags?: number }).totalFlags,
        criticalFlags: (data.summary as { criticalFlags?: number }).criticalFlags
      }
    });

    return this.prisma.proctorEvent.create({
      data: {
        sessionId: data.sessionId,
        eventType: ProctorEventType.SESSION_END,
        severity: ProctorSeverity.INFO,
        metadata: data.summary as Prisma.InputJsonValue
      }
    });
  }

  async getRecentFlags(sessionId: string) {
    await this.ensureSessionExists(sessionId);
    const rows = await this.prisma.proctorEvent.findMany({
      where: {
        sessionId,
        eventType: { in: [ProctorEventType.SUSPICIOUS_ACTIVITY, ProctorEventType.MANUAL_FLAG] }
      },
      orderBy: { timestamp: 'desc' },
      take: 20
    });
    return rows.map((row) => ({
      id: row.id,
      createdAt: row.timestamp,
      flags: (row.metadata as { flags?: string[] } | undefined)?.flags ?? [],
      severity: row.severity
    }));
  }

  async getLatestSummary(sessionId: string) {
    await this.ensureSessionExists(sessionId);
    const session = await this.prisma.proctoringSessions.findUnique({
      where: { id: sessionId }
    });
    return session;
  }

  private async ensureSessionExists(sessionId: string) {
    const session = await this.prisma.proctoringSessions.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Proctoring session not found');
    }
    return session;
  }
}
