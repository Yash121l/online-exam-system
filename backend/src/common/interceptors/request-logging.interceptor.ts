import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Request, Response } from 'express';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const userId = (req as any).user?.userId ?? (req.headers['x-user-id'] as string | undefined);

    return next.handle().pipe(
      tap(async () => {
        const durationMs = Date.now() - now;
        try {
          await this.prisma.requestLog.create({
            data: {
              method: req.method,
              path: req.url,
              statusCode: res.statusCode,
              durationMs,
              userId,
              ip: req.ip,
              userAgent: req.headers['user-agent'] ?? undefined
            }
          });
        } catch (error) {
          // Swallow logging errors to avoid impacting responses
        }
      })
    );
  }
}
