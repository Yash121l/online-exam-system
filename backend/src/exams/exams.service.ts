import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { GradeExamDto } from './dto/grade-exam.dto';
import { CreateQuestionBankItemDto, UpdateQuestionBankItemDto } from './dto/question-bank.dto';
import { ExamQuestionDto } from './dto/question.dto';
import { ScheduleExamDto, PublishExamDto } from './dto/scheduling.dto';
import { RequestPdfImportDto, TagPdfRegionsDto } from './dto/pdf-import.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ExamsService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

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

  async scheduleExam(id: string, dto: ScheduleExamDto) {
    const exam = await this.prisma.exam.update({
      where: { id },
      data: {
        scheduling: {
          windowStart: dto.windowStart,
          windowEnd: dto.windowEnd,
          navigation: dto.navigation
        } as Prisma.InputJsonValue,
        randomizeQuestions: dto.randomizeQuestions ?? false,
        randomizeOptions: dto.randomizeOptions ?? false
      }
    });
    return exam;
  }

  async publishExam(id: string, dto: PublishExamDto) {
    return this.prisma.exam.update({
      where: { id },
      data: { published: dto.published, status: dto.published ? 'published' : 'draft' }
    });
  }

  async listQuestionBank() {
    return this.prisma.questionBankItem.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  async createBankItem(dto: CreateQuestionBankItemDto) {
    return this.prisma.questionBankItem.create({
      data: {
        id: randomUUID(),
        prompt: dto.prompt,
        type: dto.type,
        format: dto.format,
        options: dto.options as Prisma.InputJsonValue,
        answerKey: dto.answerKey as Prisma.InputJsonValue,
        mediaKey: dto.mediaKey,
        topics: dto.topics as Prisma.InputJsonValue,
        difficulty: dto.difficulty,
        tags: dto.tags as Prisma.InputJsonValue
      }
    });
  }

  async updateBankItem(id: string, dto: UpdateQuestionBankItemDto) {
    return this.prisma.questionBankItem.update({
      where: { id },
      data: {
        prompt: dto.prompt,
        type: dto.type,
        format: dto.format,
        options: dto.options as Prisma.InputJsonValue,
        answerKey: dto.answerKey as Prisma.InputJsonValue,
        mediaKey: dto.mediaKey,
        topics: dto.topics as Prisma.InputJsonValue,
        difficulty: dto.difficulty,
        tags: dto.tags as Prisma.InputJsonValue
      }
    });
  }

  async deleteBankItem(id: string) {
    return this.prisma.questionBankItem.delete({ where: { id } });
  }

  async addExamQuestion(examId: string, dto: ExamQuestionDto) {
    await this.ensureExamExists(examId);
    return this.prisma.question.create({
      data: {
        id: randomUUID(),
        examId,
        prompt: dto.prompt,
        type: dto.type,
        options: dto.options as Prisma.InputJsonValue,
        answerKey: dto.answerKey as Prisma.InputJsonValue,
        bankItemId: dto.bankItemId,
        mediaKey: dto.mediaKey
      }
    });
  }

  async updateExamQuestion(examId: string, questionId: string, dto: ExamQuestionDto) {
    await this.ensureExamExists(examId);
    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        prompt: dto.prompt,
        type: dto.type,
        options: dto.options as Prisma.InputJsonValue,
        answerKey: dto.answerKey as Prisma.InputJsonValue,
        bankItemId: dto.bankItemId,
        mediaKey: dto.mediaKey
      }
    });
  }

  async deleteExamQuestion(examId: string, questionId: string) {
    await this.ensureExamExists(examId);
    return this.prisma.question.delete({ where: { id: questionId } });
  }

  async requestPdfImport(dto: RequestPdfImportDto) {
    await this.ensureExamExists(dto.examId);
    const signed = await this.storage.generateUploadUrl(dto.key, 'application/pdf');
    const record = await this.prisma.pdfImport.create({
      data: { id: randomUUID(), examId: dto.examId, pdfKey: signed.key }
    });
    return { upload: signed, import: record };
  }

  async tagPdfRegions(importId: string, dto: TagPdfRegionsDto) {
    const importRecord = await this.prisma.pdfImport.findUnique({ where: { id: importId } });
    if (!importRecord) {
      throw new NotFoundException('PDF import not found');
    }

    return this.prisma.pdfImport.update({
      where: { id: importId },
      data: { regions: dto.regions as Prisma.InputJsonValue, status: dto.status ?? 'tagged' }
    });
  }

  async requestMediaUpload(key: string, contentType: string) {
    return this.storage.generateUploadUrl(key, contentType);
  }

  getExamById(id: string) {
    return this.prisma.exam.findUnique({ where: { id } });
  }

  private async ensureExamExists(examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      throw new NotFoundException(`Exam ${examId} not found`);
    }
    return exam;
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
