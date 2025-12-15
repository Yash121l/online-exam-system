import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class ScheduleExamDto {
  @IsOptional()
  @IsDateString()
  windowStart?: string;

  @IsOptional()
  @IsDateString()
  windowEnd?: string;

  @IsOptional()
  @IsString()
  navigation?: string;

  @IsOptional()
  @IsBoolean()
  randomizeQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  randomizeOptions?: boolean;
}

export class PublishExamDto {
  @IsBoolean()
  published!: boolean;
}
