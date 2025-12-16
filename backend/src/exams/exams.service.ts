import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto, ExamConfigDto } from './dto/create-exam.dto';
import { GradeExamDto } from './dto/grade-exam.dto';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  CreateQuestionBankDto,
  UpdateQuestionBankDto
} from './dto/question-bank.dto';
import { ExamQuestionDto } from './dto/question.dto';
import { ScheduleExamDto, PublishExamDto } from './dto/scheduling.dto';
import { RequestPdfImportDto, TagPdfRegionsDto } from './dto/pdf-import.dto';
import { StorageService } from '../storage/storage.service';
import {
  ActivityType,
  DifficultyLevel,
  ExamStatus,
  ProctoringLevel,
  QuestionType
} from '@prisma/client';

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
        instructions: dto.instructions,
        examType: dto.examType,
        creatorId: dto.creatorId,
        organizationId: dto.organizationId,
        duration: dto.duration,
        accessCode: dto.accessCode,
        requireSecureClient: dto.requireSecureClient ?? false,
        allowedIpRanges: dto.allowedIpRanges ?? [],
        allowedTools: dto.allowedTools ?? [],
        proctoringLevel: dto.proctoringLevel ?? ProctoringLevel.NONE,
        proctoringConfig: (dto.proctoringConfig ?? {}) as Prisma.InputJsonValue,
        enableTextToSpeech: dto.enableTextToSpeech ?? false,
        compensatoryTime: dto.compensatoryTime,
        passingScore: dto.passingScore,
        gradingType: dto.gradingType ?? 'AUTOMATIC',
        config: this.buildExamConfig(dto.config),
        sections: dto.sections?.length
          ? {
              create: dto.sections.map((section) => ({
                id: randomUUID(),
                name: section.name,
                description: section.description,
                orderIndex: section.orderIndex,
                duration: section.duration
              }))
            }
          : undefined
      },
      include: { sections: true }
    });
    await this.logActivity({
      activityType: ActivityType.EXAM_CREATED,
      entityId: exam.id,
      entityType: 'exam',
      description: `Exam ${exam.title} created`
    });
    this.logger.log({ examId: exam.id, title: dto.title }, 'Exam created');
    return exam;
  }

  async scheduleExam(id: string, dto: ScheduleExamDto) {
    await this.ensureExamExists(id);
    return this.prisma.exam.update({
      where: { id },
      data: {
        scheduledStartTime: dto.scheduledStartTime ? new Date(dto.scheduledStartTime) : undefined,
        scheduledEndTime: dto.scheduledEndTime ? new Date(dto.scheduledEndTime) : undefined,
        duration: dto.duration ?? undefined,
        status: dto.status ?? ExamStatus.SCHEDULED
      }
    });
  }

  async publishExam(id: string, dto: PublishExamDto) {
    await this.ensureExamExists(id);
    return this.prisma.exam.update({
      where: { id },
      data: {
        status: dto.published ? ExamStatus.ACTIVE : ExamStatus.DRAFT,
        publishedAt: dto.published ? new Date() : null
      }
    });
  }

  async listQuestionBanks() {
    return this.prisma.questionBank.findMany({
      include: { tags: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async createQuestionBank(dto: CreateQuestionBankDto) {
    const bank = await this.prisma.questionBank.create({
      data: {
        id: randomUUID(),
        name: dto.name,
        description: dto.description,
        organizationId: dto.organizationId,
        isPublic: dto.isPublic ?? false
      }
    });
    if (dto.tags?.length) {
      await this.syncQuestionBankTags(bank.id, dto.tags);
    }
    return this.prisma.questionBank.findUnique({
      where: { id: bank.id },
      include: { tags: true }
    });
  }

  async updateQuestionBank(id: string, dto: UpdateQuestionBankDto) {
    await this.ensureQuestionBankExists(id);
    const bank = await this.prisma.questionBank.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        organizationId: dto.organizationId,
        isPublic: dto.isPublic ?? undefined
      }
    });
    if (dto.tags) {
      await this.syncQuestionBankTags(id, dto.tags);
    }
    return this.prisma.questionBank.findUnique({
      where: { id: bank.id },
      include: { tags: true }
    });
  }

  async deleteQuestionBank(id: string) {
    await this.ensureQuestionBankExists(id);
    await this.prisma.questionBank.delete({ where: { id } });
    return { deleted: true };
  }

  async createQuestion(dto: CreateQuestionDto) {
    await this.ensureQuestionBankExists(dto.questionBankId);
    const question = await this.prisma.question.create({
      data: {
        id: randomUUID(),
        questionBankId: dto.questionBankId,
        type: dto.type as QuestionType,
        difficulty: dto.difficulty ?? DifficultyLevel.MEDIUM,
        title: dto.title,
        questionText: dto.questionText,
        questionMediaUrls: dto.questionMediaUrls ?? [],
        answerConfig: dto.answerConfig as Prisma.InputJsonValue,
        correctAnswer: dto.correctAnswer as Prisma.InputJsonValue,
        points: dto.points ?? 1,
        negativeMarking: dto.negativeMarking ?? 0,
        partialCredit: dto.partialCredit ?? false,
        subject: dto.subject,
        topic: dto.topic,
        learningObjective: dto.learningObjective,
        bloomsTaxonomy: dto.bloomsTaxonomy
      }
    });
    if (dto.tags?.length) {
      await this.syncQuestionTags(question.id, dto.tags);
    }
    await this.logActivity({
      activityType: ActivityType.QUESTION_CREATED,
      entityId: question.id,
      entityType: 'question',
      description: 'Question created'
    });
    return this.prisma.question.findUnique({
      where: { id: question.id },
      include: { tags: true }
    });
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    await this.ensureQuestionExists(id);
    const question = await this.prisma.question.update({
      where: { id },
      data: {
        questionBankId: dto.questionBankId,
        type: dto.type,
        difficulty: dto.difficulty,
        title: dto.title,
        questionText: dto.questionText,
        questionMediaUrls: dto.questionMediaUrls ?? undefined,
        answerConfig: dto.answerConfig as Prisma.InputJsonValue,
        correctAnswer: dto.correctAnswer as Prisma.InputJsonValue,
        points: dto.points,
        negativeMarking: dto.negativeMarking,
        partialCredit: dto.partialCredit,
        subject: dto.subject,
        topic: dto.topic,
        learningObjective: dto.learningObjective,
        bloomsTaxonomy: dto.bloomsTaxonomy
      }
    });
    if (dto.tags) {
      await this.syncQuestionTags(id, dto.tags);
    }
    await this.logActivity({
      activityType: ActivityType.QUESTION_UPDATED,
      entityId: question.id,
      entityType: 'question',
      description: 'Question updated'
    });
    return this.prisma.question.findUnique({
      where: { id: question.id },
      include: { tags: true }
    });
  }

  async deleteQuestion(id: string) {
    await this.ensureQuestionExists(id);
    await this.prisma.question.delete({ where: { id } });
    return { deleted: true };
  }

  async addExamQuestion(examId: string, dto: ExamQuestionDto) {
    await this.ensureExamExists(examId);
    const question = await this.ensureQuestionExists(dto.questionId);
    if (dto.sectionId) {
      await this.ensureSectionBelongsToExam(examId, dto.sectionId);
    }
    const created = await this.prisma.examQuestion.create({
      data: {
        id: randomUUID(),
        examId,
        questionId: dto.questionId,
        sectionId: dto.sectionId,
        orderIndex: dto.orderIndex,
        points: dto.points ?? question.points,
        isMandatory: dto.isMandatory ?? true
      }
    });
    await this.recalculateExamPoints(examId);
    return created;
  }

  async updateExamQuestion(examId: string, examQuestionId: string, dto: ExamQuestionDto) {
    await this.ensureExamExists(examId);
    if (dto.sectionId) {
      await this.ensureSectionBelongsToExam(examId, dto.sectionId);
    }
    await this.prisma.examQuestion.update({
      where: { id: examQuestionId },
      data: {
        questionId: dto.questionId,
        sectionId: dto.sectionId,
        orderIndex: dto.orderIndex,
        points: dto.points,
        isMandatory: dto.isMandatory
      }
    });
    await this.recalculateExamPoints(examId);
    return this.prisma.examQuestion.findUnique({ where: { id: examQuestionId } });
  }

  async deleteExamQuestion(examId: string, examQuestionId: string) {
    await this.ensureExamExists(examId);
    await this.prisma.examQuestion.delete({ where: { id: examQuestionId } });
    await this.recalculateExamPoints(examId);
    return { deleted: true };
  }

  async requestPdfImport(dto: RequestPdfImportDto) {
    await this.ensureExamExists(dto.examId);
    const signed = await this.storage.generateUploadUrl(dto.key, 'application/pdf');
    await this.prisma.exam.update({
      where: { id: dto.examId },
      data: { sourcePdfUrl: signed.url }
    });
    return { upload: signed };
  }

  async tagPdfRegions(examId: string, dto: TagPdfRegionsDto) {
    await this.ensureExamExists(examId);
    return this.prisma.exam.update({
      where: { id: examId },
      data: { pdfQuestionMap: dto.regions as Prisma.InputJsonValue }
    });
  }

  async requestMediaUpload(key: string, contentType: string) {
    return this.storage.generateUploadUrl(key, contentType);
  }

  getExamById(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        sections: true,
        questions: { include: { question: true, section: true } }
      }
    });
  }

  async ensureExamExists(examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      throw new NotFoundException(`Exam ${examId} not found`);
    }
    return exam;
  }

  private async ensureQuestionBankExists(id: string) {
    const bank = await this.prisma.questionBank.findUnique({ where: { id } });
    if (!bank) {
      throw new NotFoundException(`Question bank ${id} not found`);
    }
    return bank;
  }

  private async ensureQuestionExists(questionId: string) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }
    return question;
  }

  private async ensureSectionBelongsToExam(examId: string, sectionId: string) {
    const section = await this.prisma.examSection.findUnique({ where: { id: sectionId } });
    if (!section || section.examId !== examId) {
      throw new BadRequestException('Section does not belong to this exam');
    }
    return section;
  }

  private buildExamConfig(config?: ExamConfigDto): Prisma.InputJsonValue {
    return {
      randomizeQuestions: config?.randomizeQuestions ?? false,
      randomizeOptions: config?.randomizeOptions ?? false,
      showQuestionsPerPage: config?.showQuestionsPerPage ?? 1,
      allowBackNavigation: config?.allowBackNavigation ?? false,
      showTimer: config?.showTimer ?? true,
      autoSubmit: config?.autoSubmit ?? true,
      sectionBased: config?.sectionBased ?? Boolean(config?.sectionTimings?.length),
      sectionTimings: config?.sectionTimings ?? []
    } as Prisma.InputJsonValue;
  }

  private async recalculateExamPoints(examId: string) {
    const examQuestions = await this.prisma.examQuestion.findMany({
      where: { examId },
      include: { question: true }
    });
    const totalPoints = examQuestions.reduce((sum, eq) => {
      const points = eq.points ?? eq.question.points ?? 0;
      return sum + points;
    }, 0);
    await this.prisma.exam.update({
      where: { id: examId },
      data: { totalPoints }
    });
  }

  private async syncQuestionTags(questionId: string, tags: string[]) {
    await this.prisma.questionTag.deleteMany({ where: { questionId, tag: { notIn: tags } } });
    const existing = await this.prisma.questionTag.findMany({ where: { questionId } });
    const existingSet = new Set(existing.map((t) => t.tag));
    const toCreate = tags.filter((tag) => !existingSet.has(tag));
    if (toCreate.length) {
      await this.prisma.questionTag.createMany({
        data: toCreate.map((tag) => ({ questionId, tag }))
      });
    }
  }

  private async syncQuestionBankTags(questionBankId: string, tags: string[]) {
    await this.prisma.questionBankTag.deleteMany({ where: { questionBankId, tag: { notIn: tags } } });
    const existing = await this.prisma.questionBankTag.findMany({ where: { questionBankId } });
    const existingSet = new Set(existing.map((t) => t.tag));
    const toCreate = tags.filter((tag) => !existingSet.has(tag));
    if (toCreate.length) {
      await this.prisma.questionBankTag.createMany({
        data: toCreate.map((tag) => ({ questionBankId, tag }))
      });
    }
  }

  private async logActivity(input: {
    activityType: ActivityType;
    entityType: string;
    entityId: string;
    description: string;
  }) {
    try {
      await this.prisma.activityLog.create({
        data: {
          activityType: input.activityType,
          entityType: input.entityType,
          entityId: input.entityId,
          description: input.description
        }
      });
    } catch (error) {
      // Avoid failing main flow if logging fails
    }
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
