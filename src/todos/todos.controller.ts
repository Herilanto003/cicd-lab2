import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { TodosService } from './todos.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import type { AuthUser } from '../auth/auth.types.js';
import type { Todo } from '../database/schema.js';

const todoSchema = {
  example: {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    userId: '3f1c2a1e-...',
    title: 'Acheter du pain',
    description: 'Pain complet, pas de baguette',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: "Liste les todos de l'utilisateur authentifié" })
  @ApiOkResponse({ description: 'Liste des todos', schema: { example: [todoSchema.example] } })
  list(@CurrentUser() user: AuthUser): Promise<Todo[]> {
    return this.todosService.list(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un todo pour l’utilisateur authentifié' })
  @ApiCreatedResponse({ description: 'Todo créé', schema: { example: todoSchema.example } })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateTodoDto,
  ): Promise<Todo> {
    return this.todosService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retourne un todo de l’utilisateur authentifié' })
  @ApiOkResponse({ description: 'Todo trouvé', schema: { example: todoSchema.example } })
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Todo> {
    return this.todosService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Met à jour un todo de l’utilisateur authentifié' })
  @ApiOkResponse({ description: 'Todo mis à jour', schema: { example: todoSchema.example } })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprime un todo de l’utilisateur authentifié' })
  @ApiNoContentResponse({ description: 'Todo supprimé' })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.todosService.remove(user.id, id);
  }
}
