import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { StorageModule } from '../storage/storage.module';
import { RolesGuard } from '../auth/roles.guard';
import { ExamSessionsController } from './exam-sessions.controller';
import { ExamSessionsService } from './exam-sessions.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    StorageModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev_secret'),
        signOptions: { expiresIn: '2h' }
      })
    })
  ],
  controllers: [ExamsController, ExamSessionsController],
  providers: [ExamsService, ExamSessionsService, RolesGuard],
  exports: [ExamsService, ExamSessionsService]
})
export class ExamsModule {}
