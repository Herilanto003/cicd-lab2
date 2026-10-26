import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants.js';
import type { Database } from '../database/database.service.js';
import { users } from '../database/schema.js';
import type { User } from '../database/schema.js';

export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findForAuthByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async getPublicById(id: string): Promise<PublicUser> {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async create(email: string, passwordHash: string): Promise<PublicUser> {
    const [user] = await this.db
      .insert(users)
      .values({ email, passwordHash })
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      });

    return user;
  }
}
