import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants.js';
import type { Database } from '../database/database.service.js';
import { todos } from '../database/schema.js';
import type { Todo } from '../database/schema.js';
import type { CreateTodoDto } from './dto/create-todo.dto.js';
import type { UpdateTodoDto } from './dto/update-todo.dto.js';

@Injectable()
export class TodosService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  list(userId: string): Promise<Todo[]> {
    return this.db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));
  }

  async findOne(userId: string, id: string): Promise<Todo> {
    const [todo] = await this.db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .limit(1);

    if (!todo) {
      throw new NotFoundException('Todo introuvable');
    }

    return todo;
  }

  async create(userId: string, dto: CreateTodoDto): Promise<Todo> {
    const [todo] = await this.db
      .insert(todos)
      .values({
        userId,
        title: dto.title,
        description: dto.description ?? null,
      })
      .returning();

    return todo;
  }

  async update(userId: string, id: string, dto: UpdateTodoDto): Promise<Todo> {
    const [todo] = await this.db
      .update(todos)
      .set({
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    if (!todo) {
      throw new NotFoundException('Todo introuvable');
    }

    return todo;
  }

  async remove(userId: string, id: string): Promise<void> {
    const [todo] = await this.db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning({ id: todos.id });

    if (!todo) {
      throw new NotFoundException('Todo introuvable');
    }
  }
}
