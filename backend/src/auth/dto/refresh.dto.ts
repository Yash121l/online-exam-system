import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}
