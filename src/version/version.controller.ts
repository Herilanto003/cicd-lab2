import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VersionService } from './version.service.js';
import type { VersionInfo } from './version.service.js';

@ApiTags('version')
@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  @ApiOperation({ summary: 'Retourne la version du service' })
  @ApiOkResponse({
    description: 'Version actuelle du service',
    schema: { example: { version: '1.0.0' } },
  })
  getVersion(): VersionInfo {
    return this.versionService.getVersion();
  }
}
