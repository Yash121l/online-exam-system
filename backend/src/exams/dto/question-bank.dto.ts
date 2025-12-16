import { DifficultyLevel, QuestionType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateQuestionBankDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateQuestionBankDto extends CreateQuestionBankDto {}

export class CreateQuestionDto {
  @IsString()
  questionBankId!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsString()
  title!: string;

  @IsString()
  questionText!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionMediaUrls?: string[];

  @IsObject()
  answerConfig!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  correctAnswer?: Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsNumber()
  negativeMarking?: number;

  @IsOptional()
  @IsBoolean()
  partialCredit?: boolean;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  learningObjective?: string;

  @IsOptional()
  @IsString()
  bloomsTaxonomy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  questionBankId?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  questionText?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionMediaUrls?: string[];

  @IsOptional()
  @IsObject()
  answerConfig?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  correctAnswer?: Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsNumber()
  negativeMarking?: number;

  @IsOptional()
  @IsBoolean()
  partialCredit?: boolean;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  learningObjective?: string;

  @IsOptional()
  @IsString()
  bloomsTaxonomy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
