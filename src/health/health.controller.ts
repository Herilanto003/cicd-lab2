import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';
import type { HealthStatus } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Retourne l’état de santé du service' })
  @ApiOkResponse({
    description: 'Le service est opérationnel',
    schema: {
      example: {
        status: 'ok',
        service: 'cicd-lab2',
        uptime: 12.34,
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  getHealth(): HealthStatus {
    return this.healthService.getHealth();
  }
}
