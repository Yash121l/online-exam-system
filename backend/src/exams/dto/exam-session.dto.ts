import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExamSessionDto {
  @IsString()
  examId!: string;

  @IsString()
  studentId!: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  clientIp?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class JoinExamSessionDto {
  @IsString()
  examKey!: string;

  @IsString()
  studentId!: string;

  @IsOptional()
  @IsString()
  clientIp?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
