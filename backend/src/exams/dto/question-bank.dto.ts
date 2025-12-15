import { QuestionTemplateType, QuestionType } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateQuestionBankItemDto {
  @IsString()
  prompt!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsEnum(QuestionTemplateType)
  format!: QuestionTemplateType;

  @IsOptional()
  @IsObject()
  options?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  answerKey?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  mediaKey?: string;

  @IsOptional()
  @IsObject()
  topics?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsObject()
  tags?: Record<string, unknown>;
}

export class UpdateQuestionBankItemDto extends CreateQuestionBankItemDto {}
