import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ExamStatus } from '@prisma/client';

export class ScheduleExamDto {
  @IsOptional()
  @IsDateString()
  scheduledStartTime?: string;

  @IsOptional()
  @IsDateString()
  scheduledEndTime?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;
}

export class PublishExamDto {
  @IsBoolean()
  published!: boolean;
}
