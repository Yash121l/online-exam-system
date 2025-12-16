import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { CreateExamDto } from './dto/create-exam.dto';
import { GradeExamDto } from './dto/grade-exam.dto';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  CreateQuestionBankDto,
  UpdateQuestionBankDto
} from './dto/question-bank.dto';
import { ExamQuestionDto } from './dto/question.dto';
import { ScheduleExamDto, PublishExamDto } from './dto/scheduling.dto';
import { RequestPdfImportDto, TagPdfRegionsDto } from './dto/pdf-import.dto';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService, private readonly logger: Logger) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createExam(@Body() dto: CreateExamDto) {
    const exam = await this.examsService.createExam(dto);
    this.logger.log({ examId: exam.id }, 'Exam created via API');
    return exam;
  }

  @Post(':id/schedule')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  scheduleExam(@Param('id') id: string, @Body() dto: ScheduleExamDto) {
    return this.examsService.scheduleExam(id, dto);
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  publishExam(@Param('id') id: string, @Body() dto: PublishExamDto) {
    return this.examsService.publishExam(id, dto);
  }

  @Post('grade')
  gradeExam(@Body() dto: GradeExamDto) {
    const result = this.examsService.gradeExam(dto);
    this.logger.log({ candidateId: dto.candidateId, total: result.totalPoints }, 'Exam graded via API');
    return result;
  }

  @Get(':id')
  async getExam(@Param('id') id: string) {
    const exam = await this.examsService.getExamById(id);
    if (!exam) {
      throw new NotFoundException(`Exam ${id} not found`);
    }
    return exam;
  }

  @Get('question-banks')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.EVALUATOR)
  getQuestionBank() {
    return this.examsService.listQuestionBanks();
  }

  @Post('question-banks')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createQuestionBank(@Body() dto: CreateQuestionBankDto) {
    return this.examsService.createQuestionBank(dto);
  }

  @Patch('question-banks/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateQuestionBank(@Param('id') id: string, @Body() dto: UpdateQuestionBankDto) {
    return this.examsService.updateQuestionBank(id, dto);
  }

  @Delete('question-banks/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  deleteQuestionBank(@Param('id') id: string) {
    return this.examsService.deleteQuestionBank(id);
  }

  @Post('question-banks/:bankId/questions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createQuestion(@Param('bankId') bankId: string, @Body() dto: CreateQuestionDto) {
    return this.examsService.createQuestion({ ...dto, questionBankId: bankId });
  }

  @Patch('questions/:questionId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateQuestionContent(@Param('questionId') questionId: string, @Body() dto: UpdateQuestionDto) {
    return this.examsService.updateQuestion(questionId, dto);
  }

  @Delete('questions/:questionId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  deleteQuestion(@Param('questionId') questionId: string) {
    return this.examsService.deleteQuestion(questionId);
  }

  @Post(':id/questions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  addQuestion(@Param('id') id: string, @Body() dto: ExamQuestionDto) {
    return this.examsService.addExamQuestion(id, dto);
  }

  @Patch(':id/questions/:questionId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateExamQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body() dto: ExamQuestionDto
  ) {
    return this.examsService.updateExamQuestion(id, questionId, dto);
  }

  @Delete(':id/questions/:questionId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeQuestion(@Param('id') id: string, @Param('questionId') questionId: string) {
    return this.examsService.deleteExamQuestion(id, questionId);
  }

  @Post('pdf-import/request')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  requestPdf(@Body() dto: RequestPdfImportDto) {
    return this.examsService.requestPdfImport(dto);
  }

  @Patch('pdf-import/:examId/regions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  tagRegions(@Param('examId') examId: string, @Body() dto: TagPdfRegionsDto) {
    return this.examsService.tagPdfRegions(examId, dto);
  }
}
