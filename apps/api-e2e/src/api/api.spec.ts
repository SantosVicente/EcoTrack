import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { AppModule } from '@org/api/src/app/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  }, 10000); // Increase timeout for bootstrapping

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/api (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello API' });
  });
});
