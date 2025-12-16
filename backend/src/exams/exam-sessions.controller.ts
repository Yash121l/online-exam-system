import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ExamSessionsService } from './exam-sessions.service';
import { CreateExamSessionDto, JoinExamSessionDto } from './dto/exam-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('exam-sessions')
export class ExamSessionsController {
  constructor(private readonly sessionsService: ExamSessionsService, private readonly logger: Logger) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() dto: CreateExamSessionDto, @Req() req: any) {
    this.logger.log({ examId: dto.examId, studentId: dto.studentId }, 'Creating exam session');
    return this.sessionsService.createSession({
      ...dto,
      clientIp: dto.clientIp ?? req.ip,
      userAgent: dto.userAgent ?? req.headers['user-agent']
    });
  }

  @Post('join')
  join(@Body() dto: JoinExamSessionDto, @Req() req: any) {
    this.logger.log({ examKey: dto.examKey }, 'Exam session join attempt');
    return this.sessionsService.joinWithKey({
      ...dto,
      clientIp: dto.clientIp ?? req.ip,
      userAgent: dto.userAgent ?? req.headers['user-agent']
    });
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
