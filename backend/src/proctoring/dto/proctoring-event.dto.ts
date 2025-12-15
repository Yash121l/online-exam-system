import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ProctoringEventDto {
  @IsString()
  eventType: string;

  @IsString()
  examSessionId: string;

  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
