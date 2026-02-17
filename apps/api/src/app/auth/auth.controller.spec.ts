import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto, UserProfile } from '@org/domain';
import { vi } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: vi.fn(),
    refreshToken: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn(),
    verify: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set cookies and return user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user: UserProfile = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const reqMock = {
        user: user,
      } as any;

      const resMock = {
        cookie: vi.fn(),
      } as unknown as Response;

      mockAuthService.login.mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        user,
      });

      const result = await controller.login(reqMock, loginDto, resMock);

      expect(resMock.cookie).toHaveBeenCalledWith(
        'access_token',
        'access_token',
        expect.any(Object)
      );
      expect(resMock.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh_token',
        expect.any(Object)
      );
      expect(result).toEqual({ user });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens when valid refresh token is present', async () => {
      const reqMock = {
        cookies: { refresh_token: 'valid_refresh_token' },
      } as any;

      const resMock = {
        cookie: vi.fn(),
      } as unknown as Response;

      mockAuthService.refreshToken.mockResolvedValue({
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
      });

      await controller.refresh(reqMock, resMock);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        'valid_refresh_token'
      );
      expect(resMock.cookie).toHaveBeenCalledWith(
        'access_token',
        'new_access_token',
        expect.any(Object)
      );
      expect(resMock.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new_refresh_token',
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedException if no refresh token', async () => {
      const reqMock = {
        cookies: {},
      } as any;

      const resMock = {
        cookie: vi.fn(),
      } as unknown as Response;

      await expect(controller.refresh(reqMock, resMock)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should clear cookies', async () => {
      const resMock = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      await controller.logout(resMock);

      expect(resMock.clearCookie).toHaveBeenCalledWith('access_token');
      expect(resMock.clearCookie).toHaveBeenCalledWith('refresh_token');
    });
  });
});
