import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
  service: string;
  uptime: number;
  timestamp: string;
}

@Injectable()
export class HealthService {
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      service: 'cicd-lab2',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
