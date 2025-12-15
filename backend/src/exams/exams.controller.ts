import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { CreateExamDto } from './dto/create-exam.dto';
import { GradeExamDto } from './dto/grade-exam.dto';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateQuestionBankItemDto, UpdateQuestionBankItemDto } from './dto/question-bank.dto';
import { ExamQuestionDto } from './dto/question.dto';
import { ScheduleExamDto, PublishExamDto } from './dto/scheduling.dto';
import { RequestPdfImportDto, TagPdfRegionsDto } from './dto/pdf-import.dto';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService, private readonly logger: Logger) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  async createExam(@Body() dto: CreateExamDto) {
    const exam = await this.examsService.createExam(dto);
    this.logger.log({ examId: exam.id }, 'Exam created via API');
    return exam;
  }

  @Post(':id/schedule')
  @Roles(Role.ADMIN, Role.TEACHER)
  scheduleExam(@Param('id') id: string, @Body() dto: ScheduleExamDto) {
    return this.examsService.scheduleExam(id, dto);
  }

  @Post(':id/publish')
  @Roles(Role.ADMIN, Role.TEACHER)
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

  @Get('question-bank/items')
  @Roles(Role.ADMIN, Role.TEACHER, Role.EVALUATOR)
  getQuestionBank() {
    return this.examsService.listQuestionBank();
  }

  @Post('question-bank/items')
  @Roles(Role.ADMIN, Role.TEACHER)
  createBankItem(@Body() dto: CreateQuestionBankItemDto) {
    return this.examsService.createBankItem(dto);
  }

  @Patch('question-bank/items/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  updateBankItem(@Param('id') id: string, @Body() dto: UpdateQuestionBankItemDto) {
    return this.examsService.updateBankItem(id, dto);
  }

  @Delete('question-bank/items/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  deleteBankItem(@Param('id') id: string) {
    return this.examsService.deleteBankItem(id);
  }

  @Post(':id/questions')
  @Roles(Role.ADMIN, Role.TEACHER)
  addQuestion(@Param('id') id: string, @Body() dto: ExamQuestionDto) {
    return this.examsService.addExamQuestion(id, dto);
  }

  @Patch(':id/questions/:questionId')
  @Roles(Role.ADMIN, Role.TEACHER)
  updateQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body() dto: ExamQuestionDto
  ) {
    return this.examsService.updateExamQuestion(id, questionId, dto);
  }

  @Delete(':id/questions/:questionId')
  @Roles(Role.ADMIN, Role.TEACHER)
  removeQuestion(@Param('id') id: string, @Param('questionId') questionId: string) {
    return this.examsService.deleteExamQuestion(id, questionId);
  }

  @Post('pdf-import/request')
  @Roles(Role.ADMIN, Role.TEACHER)
  requestPdf(@Body() dto: RequestPdfImportDto) {
    return this.examsService.requestPdfImport(dto);
  }

  @Patch('pdf-import/:importId/regions')
  @Roles(Role.ADMIN, Role.TEACHER)
  tagRegions(@Param('importId') importId: string, @Body() dto: TagPdfRegionsDto) {
    return this.examsService.tagPdfRegions(importId, dto);
  }
}
