import { ProctorEventType, ProctorSeverity } from '@prisma/client';
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ProctoringEventDto {
  @IsEnum(ProctorEventType)
  eventType!: ProctorEventType;

  @IsOptional()
  @IsEnum(ProctorSeverity)
  severity?: ProctorSeverity;

  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  snapshotUrl?: string;
}
