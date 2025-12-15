import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import { ExamsService } from './exams.service';
import { CreateExamSessionDto, JoinExamSessionDto } from './dto/exam-session.dto';
import { SessionStatus } from '@prisma/client';

function generateAccessKey() {
  const segments = Array.from({ length: 3 }, () => Math.random().toString(36).substring(2, 6).toUpperCase());
  return `AE-${segments.join('-')}`;
}

@Injectable()
export class ExamSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly examsService: ExamsService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async createSession(dto: CreateExamSessionDto) {
    await this.examsService.ensureExamExists(dto.examId);
    const session = await this.prisma.examSession.create({
      data: {
        examId: dto.examId,
        candidateId: dto.candidateId,
        candidateName: dto.candidateName,
        accessKey: generateAccessKey(),
        status: SessionStatus.PENDING
      }
    });
    const sessionToken = this.buildSessionToken(session.id, session.examId, session.candidateName);
    this.logger.log({ sessionId: session.id, examId: session.examId }, 'Exam session created');
    return { session, sessionToken };
  }

  async joinWithKey(dto: JoinExamSessionDto) {
    const session = await this.prisma.examSession.findFirst({ where: { accessKey: dto.examKey }, include: { exam: true } });
    if (!session) {
      throw new NotFoundException('Exam session not found for provided key');
    }

    const sessionToken = this.buildSessionToken(session.id, session.examId, dto.candidateName ?? session.candidateName);
    return { session, sessionToken };
  }

  async listAssignedSessions(userId: string) {
    return this.prisma.examSession.findMany({
      where: { candidateId: userId },
      include: { exam: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async listUpcoming() {
    return this.prisma.examSession.findMany({
      where: {},
      include: { exam: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }

  private buildSessionToken(sessionId: string, examId: string, candidateName?: string | null) {
    return this.jwtService.sign({ sessionId, examId, candidateName });
  }
}
