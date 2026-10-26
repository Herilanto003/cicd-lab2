import { Injectable } from '@nestjs/common';

export interface VersionInfo {
  version: string;
}

@Injectable()
export class VersionService {
  getVersion(): VersionInfo {
    return {
      version: '1.0.0',
    };
  }
}
