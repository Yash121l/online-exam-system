import { Injectable } from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocketLogService {
  constructor(private readonly prisma: PrismaService, private readonly logger: Logger) {}

  async log(event: {
    eventType: string;
    socketId?: string;
    userId?: string;
    payload?: Record<string, unknown>;
  }) {
    try {
      await this.prisma.activityLog.create({
        data: {
          activityType: ActivityType.SECURITY_VIOLATION,
          description: event.eventType,
          entityType: 'socket_event',
          entityId: event.socketId,
          userId: event.userId,
          metadata: event.payload as Prisma.InputJsonValue
        }
      });
    } catch (error) {
      this.logger.warn({ err: error, eventType: event.eventType }, 'Failed to persist socket log');
    }
  }
}
