import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DRIZZLE } from '../database/database.constants.js';
import { TodosService } from './todos.service.js';

describe('TodosService', () => {
  let todosService: TodosService;

  const createService = async (db: unknown): Promise<TodosService> => {
    const moduleRef = await Test.createTestingModule({
      providers: [TodosService, { provide: DRIZZLE, useValue: db }],
    }).compile();

    return moduleRef.get(TodosService);
  };

  it('returns the todos of a user ordered by creation date', async () => {
    const rows = [{ id: 'todo-1' }];
    const orderBy = vi.fn().mockResolvedValue(rows);
    const where = vi.fn().mockReturnValue({ orderBy });
    const from = vi.fn().mockReturnValue({ where });
    const select = vi.fn().mockReturnValue({ from });

    todosService = await createService({ select });

    await expect(todosService.list('user-1')).resolves.toEqual(rows);
    expect(orderBy).toHaveBeenCalledTimes(1);
  });

  it('throws when a todo is not found for the user', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn().mockReturnValue({ limit });
    const from = vi.fn().mockReturnValue({ where });
    const select = vi.fn().mockReturnValue({ from });

    todosService = await createService({ select });

    await expect(
      todosService.findOne('user-1', 'todo-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a todo attached to the authenticated user', async () => {
    const row = { id: 'todo-1', userId: 'user-1', title: 'Acheter du pain' };
    const returning = vi.fn().mockResolvedValue([row]);
    const values = vi.fn().mockReturnValue({ returning });
    const insert = vi.fn().mockReturnValue({ values });

    todosService = await createService({ insert });

    const result = await todosService.create('user-1', {
      title: 'Acheter du pain',
    });

    expect(values).toHaveBeenCalledWith({
      userId: 'user-1',
      title: 'Acheter du pain',
      description: null,
    });
    expect(result).toEqual(row);
  });

  it('throws when deleting a todo that does not belong to the user', async () => {
    const returning = vi.fn().mockResolvedValue([]);
    const where = vi.fn().mockReturnValue({ returning });
    const del = vi.fn().mockReturnValue({ where });

    todosService = await createService({ delete: del });

    await expect(
      todosService.remove('user-1', 'todo-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
