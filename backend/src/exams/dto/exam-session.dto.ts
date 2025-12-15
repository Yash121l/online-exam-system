import { IsOptional, IsString } from 'class-validator';

export class CreateExamSessionDto {
  @IsString()
  examId: string;

  @IsString()
  candidateName: string;

  @IsOptional()
  @IsString()
  candidateId?: string;
}

export class JoinExamSessionDto {
  @IsString()
  examKey: string;

  @IsOptional()
  @IsString()
  candidateName?: string;
}
