import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  submittedAnswer: string;
}

export class AnswerKeyDto {
  @IsString()
  questionId: string;

  @IsString()
  correctAnswer: string;

  @IsNumber()
  points: number;
}

export class GradeExamDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerKeyDto)
  answerKey: AnswerKeyDto[];

  @IsOptional()
  @IsString()
  candidateId?: string;
}
