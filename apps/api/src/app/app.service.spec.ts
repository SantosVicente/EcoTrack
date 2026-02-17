import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { AppService } from './app.service.js';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  it('should return "Hello API"', () => {
    expect(service.getData()).toEqual({ message: 'Hello API' });
  });
});
