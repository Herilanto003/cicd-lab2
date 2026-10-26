import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should return an ok status', () => {
    const health = healthController.getHealth();

    expect(health.status).toBe('ok');
    expect(health.service).toBe('cicd-lab2');
    expect(health.uptime).toBeGreaterThanOrEqual(0);
    expect(new Date(health.timestamp).toString()).not.toBe('Invalid Date');
  });
});
