import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamType, ProctoringLevel } from '@prisma/client';

export class ExamConfigDto {
  @IsOptional()
  @IsBoolean()
  randomizeQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  randomizeOptions?: boolean;

  @IsOptional()
  @IsNumber()
  showQuestionsPerPage?: number;

  @IsOptional()
  @IsBoolean()
  allowBackNavigation?: boolean;

  @IsOptional()
  @IsBoolean()
  showTimer?: boolean;

  @IsOptional()
  @IsBoolean()
  autoSubmit?: boolean;

  @IsOptional()
  @IsBoolean()
  sectionBased?: boolean;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  sectionTimings?: Record<string, unknown>[];
}

export class ExamSectionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  orderIndex!: number;

  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class CreateExamDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsEnum(ExamType)
  examType!: ExamType;

  @IsString()
  creatorId!: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  accessCode?: string;

  @IsOptional()
  @IsBoolean()
  requireSecureClient?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedIpRanges?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ExamConfigDto)
  config?: ExamConfigDto;

  @IsOptional()
  @IsEnum(ProctoringLevel)
  proctoringLevel?: ProctoringLevel;

  @IsOptional()
  @IsObject()
  proctoringConfig?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedTools?: string[];

  @IsOptional()
  @IsBoolean()
  enableTextToSpeech?: boolean;

  @IsOptional()
  @IsNumber()
  compensatoryTime?: number;

  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @IsOptional()
  @IsString()
  gradingType?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamSectionDto)
  sections?: ExamSectionDto[];
}
