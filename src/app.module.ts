import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { HelloModule } from './hello/hello.module.js';

@Module({
  imports: [HelloModule, HealthModule],
})
export class AppModule {}
