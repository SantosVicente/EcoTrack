vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
  genSalt: vi.fn(),
}));
vi.mock('@org/domain', () => ({
  UserProfile: class {},
  RegisterDTO: class {},
  MeDTO: class {},
}));
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import type { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserProfile } from '@org/domain';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockUser: UserProfile = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jwtService = {
      sign: vi.fn(() => 'mock_token'),
      verify: vi.fn(() => ({
        sub: 'user-id',
        email: 'test@example.com',
      })),
    } as unknown as JwtService;

    usersService = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      updateRefreshToken: vi.fn(),
    } as unknown as UsersService;

    service = new AuthService(jwtService, usersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const result = await service.login(mockUser);
      expect(result).toEqual({
        user: mockUser,
        access_token: 'mock_token',
        refresh_token: 'mock_token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const password = 'password';
      const hash = '$2b$10$hashedpassword';
      const user = { ...mockUser, passwordHash: hash };

      vi.spyOn(usersService, 'findByEmail').mockResolvedValue(user as any);
      vi.spyOn(service, 'comparePassword').mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, password);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      vi.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      const result = await service.validateUser('wrong@email.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password mismatch', async () => {
      const user = { ...mockUser, passwordHash: 'hash' };
      vi.spyOn(usersService, 'findByEmail').mockResolvedValue(user as any);
      vi.spyOn(service, 'comparePassword').mockResolvedValue(false);

      const result = await service.validateUser(mockUser.email, 'wrong');
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create user and return login result', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };

      vi.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      vi.spyOn(service, 'hashPassword').mockResolvedValue('hashed');
      vi.spyOn(usersService, 'create').mockResolvedValue(mockUser);
      vi.spyOn(service, 'login').mockResolvedValue({
        user: mockUser,
        access_token: 'token',
        refresh_token: 'refresh',
      });

      const result = await service.register(dto);

      expect(usersService.create).toHaveBeenCalledWith({
        ...dto,
        passwordHash: 'hashed',
      });
      expect(result).toEqual({
        user: mockUser,
        access_token: 'token',
        refresh_token: 'refresh',
      });
    });

    it('should throw if user exists', async () => {
      vi.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      await expect(
        service.register({ email: 'existing@example.com' } as any)
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
