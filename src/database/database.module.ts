import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { DRIZZLE } from './database.constants.js';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: DRIZZLE,
      useFactory: (databaseService: DatabaseService) => databaseService.db,
      inject: [DatabaseService],
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
