import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { CreateExamDto } from './dto/create-exam.dto';
import { GradeExamDto } from './dto/grade-exam.dto';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService, private readonly logger: Logger) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExam(@Body() dto: CreateExamDto) {
    const exam = await this.examsService.createExam(dto);
    this.logger.log({ examId: exam.id }, 'Exam created via API');
    return exam;
  }

  @Post('grade')
  @UseGuards(JwtAuthGuard)
  gradeExam(@Body() dto: GradeExamDto) {
    const result = this.examsService.gradeExam(dto);
    this.logger.log({ candidateId: dto.candidateId, total: result.totalPoints }, 'Exam graded via API');
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getExam(@Param('id') id: string) {
    const exam = await this.examsService.getExamById(id);
    if (!exam) {
      throw new NotFoundException(`Exam ${id} not found`);
    }
    return exam;
  }
}
