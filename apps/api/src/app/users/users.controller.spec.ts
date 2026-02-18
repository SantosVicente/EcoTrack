import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto, UpdatePasswordDto, UserProfile } from '@org/domain';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser: UserProfile = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockUsersService = {
    me: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    updatePassword: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('should return user profile', async () => {
      const req = {
        user: { userId: 'user-id', email: 'test@example.com' },
      } as any;
      mockUsersService.me.mockResolvedValue(mockUser);

      const result = await controller.me(req);

      expect(usersService.me).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const req = {
        user: { userId: 'user-id', email: 'test@example.com' },
      } as any;
      const dto: UpdateUserDto = { firstName: 'Updated' };
      const updatedUser = { ...mockUser, ...dto };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(req, dto);

      expect(usersService.update).toHaveBeenCalledWith('user-id', dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete user account', async () => {
      const req = {
        user: { userId: 'user-id', email: 'test@example.com' },
      } as any;
      mockUsersService.delete.mockResolvedValue(undefined);

      await controller.delete(req);

      expect(usersService.delete).toHaveBeenCalledWith('user-id');
    });
  });

  describe('updatePassword', () => {
    it('should update password when old password is correct', async () => {
      const req = {
        user: { userId: 'user-id', email: 'test@example.com' },
      } as any;
      const dto: UpdatePasswordDto = {
        oldPassword: 'oldPossible',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      const userWithPassword = {
        ...mockUser,
        passwordHash: '$2b$10$hashedoldpassword',
      };
      mockUsersService.findById.mockResolvedValue(userWithPassword);
      mockUsersService.updatePassword.mockResolvedValue({
        success: true,
        message: 'Password updated successfully',
      });

      vi.mock('bcrypt', () => ({
        compare: vi.fn().mockResolvedValue(true),
        hash: vi.fn().mockResolvedValue('newHashedPassword'),
      }));

      const result = await controller.updatePassword(req, dto);

      expect(usersService.findById).toHaveBeenCalledWith('user-id');
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        'user-id',
        'newHashedPassword'
      );
      expect(result).toEqual({
        success: true,
        message: 'Password updated successfully',
      });
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const req = { user: { userId: 'user-id' } } as any;
      const dto: UpdatePasswordDto = {
        oldPassword: 'old',
        newPassword: 'new',
        confirmPassword: 'mismatch',
      };

      await expect(controller.updatePassword(req, dto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const req = { user: { userId: 'user-id' } } as any;
      const dto: UpdatePasswordDto = {
        oldPassword: 'old',
        newPassword: 'new',
        confirmPassword: 'new',
      };

      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.updatePassword(req, dto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
