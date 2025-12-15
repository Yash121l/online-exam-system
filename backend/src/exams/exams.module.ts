import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { StorageModule } from '../storage/storage.module';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [StorageModule],
  controllers: [ExamsController],
  providers: [ExamsService, RolesGuard],
  exports: [ExamsService]
})
export class ExamsModule {}
