import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { TodosController } from './todos.controller.js';
import { TodosService } from './todos.service.js';

@Module({
  imports: [AuthModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
