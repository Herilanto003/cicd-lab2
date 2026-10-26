import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { HelloModule } from './hello/hello.module.js';
import { TodosModule } from './todos/todos.module.js';
import { UsersModule } from './users/users.module.js';
import { VersionModule } from './version/version.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HelloModule,
    HealthModule,
    VersionModule,
    UsersModule,
    AuthModule,
    TodosModule,
  ],
})
export class AppModule {}
