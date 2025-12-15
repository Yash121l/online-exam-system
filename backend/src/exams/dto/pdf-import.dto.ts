import { IsObject, IsOptional, IsString } from 'class-validator';

export class RequestPdfImportDto {
  @IsString()
  examId!: string;

  @IsString()
  key!: string;
}

export class TagPdfRegionsDto {
  @IsObject()
  regions!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  status?: string;
}
