import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class ClientLogDto {
  @IsString()
  source: 'frontend' | 'electron';

  @IsIn(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
