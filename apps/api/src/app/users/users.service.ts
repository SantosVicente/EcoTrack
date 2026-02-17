import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/constants';
import * as database from '@org/database';
import { CreateUserDto, User, UserProfile } from '@org/domain';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: database.DrizzleDB) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: database.eq(database.users.email, email),
    });
    return result as User | null;
  }

  async create(createUserDto: CreateUserDto): Promise<UserProfile> {
    const [createdUser] = await this.db
      .insert(database.users)
      .values({
        ...createUserDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...result } = createdUser;

    return result as UserProfile;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.db
      .update(database.users)
      .set({ refreshTokenHash: refreshToken })
      .where(database.eq(database.users.id, userId));
  }
}
