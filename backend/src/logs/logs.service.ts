import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ClientLogDto } from './dto/client-log.dto';

@Injectable()
export class LogsService {
  constructor(private readonly logger: Logger) {}

  ingest(dto: ClientLogDto) {
    const context = { source: dto.source, ...dto.context };
    switch (dto.level) {
      case 'warn':
        this.logger.warn(context, dto.message);
        break;
      case 'error':
      case 'fatal':
        this.logger.error(context, dto.message);
        break;
      case 'debug':
      case 'trace':
      case 'info':
      default:
        this.logger.log(context, dto.message);
        break;
    }

    return { received: true };
  }
}
