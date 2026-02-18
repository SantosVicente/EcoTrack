import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DRIZZLE } from '../database/constants';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let db: any;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    passwordHash: 'hashed_password',
    refreshTokenHash: 'hashed_refresh_token',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockDb = {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    db = module.get(DRIZZLE);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      db.query.users.findFirst.mockResolvedValue(mockUser);
      const result = await service.findById('user-id');
      expect(result).toEqual(mockUser);
    });

    it('should return null if not found', async () => {
      db.query.users.findFirst.mockResolvedValue(null);
      const result = await service.findById('user-id');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      db.query.users.findFirst.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('me', () => {
    it('should return user profile without sensitive data', async () => {
      db.query.users.findFirst.mockResolvedValue(mockUser);
      const { passwordHash, refreshTokenHash, ...expectedProfile } = mockUser;

      const result = await service.me({
        email: 'test@example.com',
        userId: 'user-id',
      });
      expect(result).toEqual(expectedProfile);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      db.query.users.findFirst.mockResolvedValue(null);
      await expect(
        service.me({ email: 'test@example.com', userId: 'user-id' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('should update user and return profile', async () => {
      const updatedUser = { ...mockUser, firstName: 'Updated' };
      db.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedUser]),
          }),
        }),
      });

      // Need to restructure mock for the chainable calls
      mockDb.update.mockReturnThis();
      mockDb.set.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.returning.mockResolvedValue([updatedUser]);

      const { passwordHash, refreshTokenHash, ...expectedProfile } =
        updatedUser;
      const result = await service.update('user-id', { firstName: 'Updated' });

      expect(result).toEqual(expectedProfile);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockDb.delete.mockReturnThis();
      mockDb.where.mockResolvedValue(undefined);

      await service.delete('user-id');
      expect(db.delete).toHaveBeenCalled();
    });
  });
});
