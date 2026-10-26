import { Test, TestingModule } from '@nestjs/testing';
import { VersionController } from './version.controller.js';
import { VersionService } from './version.service.js';

describe('VersionController', () => {
  let versionController: VersionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [VersionService],
    }).compile();

    versionController = app.get<VersionController>(VersionController);
  });

  it('should return version "1.0.0"', () => {
    expect(versionController.getVersion()).toEqual({ version: '1.0.0' });
  });
});
