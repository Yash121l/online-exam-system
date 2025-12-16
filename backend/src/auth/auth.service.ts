import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ActivityType, Prisma, User, UserStatus } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_TTL_HOURS = 24 * 7; // 7 days

  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto, context?: { ip?: string; userAgent?: string }) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, dto.username ? { username: dto.username } : undefined].filter(Boolean) as Prisma.UserWhereInput[]
      }
    });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        passwordHash,
        phoneNumber: dto.phoneNumber,
        organizationId: dto.organizationId,
        status: UserStatus.PENDING_VERIFICATION
      }
    });
    await this.logActivity({
      activityType: ActivityType.USER_CREATED,
      userId: user.id,
      description: 'User registered',
      ipAddress: context?.ip,
      userAgent: context?.userAgent
    });
    return this.buildAuthResponse(user, {
      deviceInfo: 'registration',
      ipAddress: context?.ip
    });
  }

  async login(dto: LoginDto, context?: { ip?: string; userAgent?: string; deviceInfo?: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === UserStatus.SUSPENDED || user.deletedAt) {
      throw new ForbiddenException('Account is not active');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: context?.ip }
    });

    await this.logActivity({
      activityType: ActivityType.USER_LOGIN,
      userId: user.id,
      description: 'User login',
      ipAddress: context?.ip,
      userAgent: context?.userAgent
    });

    return this.buildAuthResponse(updatedUser, {
      deviceInfo: context?.deviceInfo ?? context?.userAgent,
      ipAddress: context?.ip
    });
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const hashedToken = this.hashToken(dto.refreshToken);
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!tokenRecord || !tokenRecord.user || tokenRecord.user.deletedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true }
    });

    return this.buildAuthResponse(tokenRecord.user, {
      deviceInfo: dto.deviceInfo,
      ipAddress: dto.ipAddress
    });
  }

  async logout(dto: RefreshTokenDto) {
    const hashedToken = this.hashToken(dto.refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { token: hashedToken, isRevoked: false },
      data: { isRevoked: true }
    });
    return { success: true };
  }

  private async buildAuthResponse(
    user: User,
    context?: { deviceInfo?: string; ipAddress?: string }
  ): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, 'passwordHash'>; expiresAt: Date }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };
    const accessToken = this.jwtService.sign(payload);
    const { refreshToken, expiresAt } = await this.issueRefreshToken(user, context);
    return { accessToken, refreshToken, user: this.sanitizeUser(user), expiresAt };
  }

  private async issueRefreshToken(
    user: User,
    context?: { deviceInfo?: string; ipAddress?: string }
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    const refreshToken = randomBytes(32).toString('hex');
    const hashed = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_TTL_HOURS * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({
      data: {
        token: hashed,
        userId: user.id,
        expiresAt,
        deviceInfo: context?.deviceInfo,
        ipAddress: context?.ipAddress
      }
    });
    return { refreshToken, expiresAt };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }

  private async logActivity(input: {
    activityType: ActivityType;
    userId?: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.activityLog.create({
        data: {
          activityType: input.activityType,
          description: input.description,
          userId: input.userId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent
        }
      });
    } catch (error) {
      // Swallow logging errors to avoid affecting auth flow
    }
  }
}
