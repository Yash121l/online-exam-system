import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocketLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(event: {
    eventType: string;
    socketId?: string;
    userId?: string;
    payload?: Record<string, unknown>;
  }) {
    return this.prisma.socketEventLog.create({
      data: {
        eventType: event.eventType,
        socketId: event.socketId,
        userId: event.userId,
        payload: event.payload as Prisma.InputJsonValue
      }
    });
  }
}
