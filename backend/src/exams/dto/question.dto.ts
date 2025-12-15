import { QuestionType } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class ExamQuestionDto {
  @IsString()
  prompt!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

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
  @IsString()
  bankItemId?: string;
}
