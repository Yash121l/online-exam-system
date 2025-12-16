import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExamQuestionDto {
  @IsString()
  questionId!: string;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsNumber()
  orderIndex!: number;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;
}
