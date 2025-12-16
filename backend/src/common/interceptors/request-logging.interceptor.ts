import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Request, Response } from 'express';
import { tap } from 'rxjs/operators';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const userId = (req as any).user?.userId ?? (req.headers['x-user-id'] as string | undefined);

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - now;
        this.logger.debug(
          {
            method: req.method,
            path: req.url,
            statusCode: res.statusCode,
            durationMs,
            userId,
            ip: req.ip,
            userAgent: req.headers['user-agent']
          },
          'Request completed'
        );
      })
    );
  }
}
