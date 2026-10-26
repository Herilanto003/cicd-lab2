import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { HelloModule } from './hello/hello.module.js';
import { VersionModule } from './version/version.module.js';

@Module({
  imports: [HelloModule, HealthModule, VersionModule],
})
export class AppModule {}
