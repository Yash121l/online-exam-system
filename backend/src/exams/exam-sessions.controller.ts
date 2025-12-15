import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ExamSessionsService } from './exam-sessions.service';
import { CreateExamSessionDto, JoinExamSessionDto } from './dto/exam-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('exam-sessions')
export class ExamSessionsController {
  constructor(private readonly sessionsService: ExamSessionsService, private readonly logger: Logger) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() dto: CreateExamSessionDto) {
    this.logger.log({ examId: dto.examId, candidateId: dto.candidateId }, 'Creating exam session');
    return this.sessionsService.createSession(dto);
  }

  @Post('join')
  join(@Body() dto: JoinExamSessionDto) {
    this.logger.log({ examKey: dto.examKey }, 'Exam session join attempt');
    return this.sessionsService.joinWithKey(dto);
  }

  @Get('assigned')
  @UseGuards(JwtAuthGuard)
  assigned(@Req() req: any) {
    return this.sessionsService.listAssignedSessions(req.user.userId);
  }

  @Get('upcoming')
  listUpcoming() {
    return this.sessionsService.listUpcoming();
  }
}
