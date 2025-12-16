import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AttemptStatus, ExamStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import { ExamsService } from './exams.service';
import { CreateExamSessionDto, JoinExamSessionDto } from './dto/exam-session.dto';

@Injectable()
export class ExamSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly examsService: ExamsService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async createSession(dto: CreateExamSessionDto) {
    const exam = await this.examsService.ensureExamExists(dto.examId);
    const student = await this.prisma.user.findUnique({ where: { id: dto.studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const assignment = await this.prisma.examAssignment.upsert({
      where: { examId_studentId: { examId: dto.examId, studentId: dto.studentId } },
      create: {
        id: randomUUID(),
        examId: dto.examId,
        studentId: dto.studentId,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined
      },
      update: {
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined
      }
    });

    const attemptNumber =
      (await this.prisma.examAttempt.count({ where: { examId: dto.examId, studentId: dto.studentId } })) + 1;

    const attempt = await this.prisma.examAttempt.create({
      data: {
        id: randomUUID(),
        examId: dto.examId,
        studentId: dto.studentId,
        attemptNumber,
        status: AttemptStatus.NOT_STARTED,
        ipAddress: dto.clientIp,
        userAgent: dto.userAgent
      }
    });

    const proctoringSession = await this.prisma.proctoringSessions.create({
      data: {
        id: randomUUID(),
        attemptId: attempt.id,
        studentId: dto.studentId
      }
    });

    const sessionToken = this.buildSessionToken(attempt.id, exam.id, dto.studentId, proctoringSession.id);
    this.logger.log({ examId: exam.id, studentId: dto.studentId, attemptId: attempt.id }, 'Exam attempt created');
    return { assignment, attempt, proctoringSession, sessionToken };
  }

  async joinWithKey(dto: JoinExamSessionDto) {
    const exam = await this.prisma.exam.findUnique({ where: { accessCode: dto.examKey } });
    if (!exam) {
      throw new NotFoundException('Exam not found for provided access code');
    }
    return this.createSession({
      examId: exam.id,
      studentId: dto.studentId,
      clientIp: dto.clientIp,
      userAgent: dto.userAgent
    });
  }

  async listAssignedSessions(userId: string) {
    return this.prisma.examAssignment.findMany({
      where: { studentId: userId },
      include: { exam: true },
      orderBy: { assignedAt: 'desc' }
    });
  }

  async listUpcoming() {
    return this.prisma.exam.findMany({
      where: { status: { in: [ExamStatus.SCHEDULED, ExamStatus.ACTIVE] } },
      orderBy: { scheduledStartTime: 'asc' },
      take: 10
    });
  }

  private buildSessionToken(attemptId: string, examId: string, studentId: string, proctoringSessionId: string) {
    return this.jwtService.sign({ attemptId, examId, studentId, proctoringSessionId });
  }
}
