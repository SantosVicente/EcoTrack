import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@org/api/app/app.module';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import cookieParser from 'cookie-parser';

describe('Users & Auth (e2e)', () => {
  let app: INestApplication;
  let agent: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
    agent = request.agent(app.getHttpServer());
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  const email = `e2e-test-${Date.now()}@example.com`;
  const password = 'Testing123!@#';
  const newPassword = 'NewPassword123!@#';

  it('1. Register', async () => {
    const response = await agent.post('/auth/register').send({
      email,
      password,
      firstName: 'E2E',
      lastName: 'Test',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });

  it('2. Get Profile', async () => {
    const response = await agent.get('/users/me');

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(email);
  });

  it('3. Update Profile', async () => {
    const response = await agent
      .patch('/users/me')
      .send({ firstName: 'Updated' });

    if (response.status !== 200) {
      console.log('Update Profile Failed:', response.status, response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Updated');
  });

  it('4. Forgot Password', async () => {
    const response = await agent.post('/auth/forgot-password').send({ email });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    process.env['RESET_TOKEN'] = response.body.token;
  });

  it('5. Reset Password', async () => {
    const token = process.env['RESET_TOKEN'];
    const response = await agent.post('/auth/reset-password').send({
      token,
      newPassword,
      confirmPassword: newPassword,
    });

    expect(response.status).toBe(201);
  });

  it('6. Login with New Password', async () => {
    const response = await agent.post('/auth/login').send({
      email,
      password: newPassword,
    });

    expect(response.status).toBe(201);
  });

  it('7. Delete Account', async () => {
    const response = await agent.delete('/users/me');

    if (response.status !== 200) {
      console.log('Delete Account Failed:', response.status, response.body);
    }
    expect(response.status).toBe(200);
  });

  it('8. Verify Login fails', async () => {
    const response = await agent.post('/auth/login').send({
      email,
      password: newPassword,
    });

    expect(response.status).toBe(401);
  });
});
