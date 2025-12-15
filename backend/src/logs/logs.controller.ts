import { Body, Controller, Post } from '@nestjs/common';
import { ClientLogDto } from './dto/client-log.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  ingest(@Body() dto: ClientLogDto) {
    return this.logsService.ingest(dto);
  }
}
