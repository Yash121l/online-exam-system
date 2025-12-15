import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { GradeExamDto } from './dto/grade-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly logger: Logger, private readonly prisma: PrismaService) {}

  async createExam(dto: CreateExamDto) {
    const exam = await this.prisma.exam.create({
      data: {
        id: randomUUID(),
        title: dto.title,
        description: dto.description,
        sections: dto.sections as unknown as Prisma.InputJsonValue
      }
    });
    this.logger.log({ examId: exam.id, title: dto.title }, 'Exam created');
    return { ...exam };
  }

  getExamById(id: string) {
    return this.prisma.exam.findUnique({ where: { id } });
  }

  gradeExam(dto: GradeExamDto) {
    const answersMap = new Map(dto.answers.map((ans) => [ans.questionId, ans]));
    let totalPoints = 0;
    let earnedPoints = 0;

    const breakdown = dto.answerKey.map((key) => {
      const submitted = answersMap.get(key.questionId);
      const isCorrect =
        submitted?.submittedAnswer?.trim().toLowerCase() ===
        key.correctAnswer.trim().toLowerCase();

      totalPoints += key.points;
      if (isCorrect) {
        earnedPoints += key.points;
      }

      return {
        questionId: key.questionId,
        correct: isCorrect,
        points: key.points,
        earned: isCorrect ? key.points : 0,
        submittedAnswer: submitted?.submittedAnswer
      };
    });

    const percentage = totalPoints === 0 ? 0 : (earnedPoints / totalPoints) * 100;
    const result = {
      candidateId: dto.candidateId,
      totalPoints,
      earnedPoints,
      percentage,
      breakdown
    };

    this.logger.log(
      { candidateId: dto.candidateId, totalPoints, earnedPoints, percentage },
      'Exam graded'
    );
    return result;
  }
}
