import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE } from '../database/constants';
import * as database from '@org/database';
import {
  CreateUserDto,
  MeDTO,
  UpdateUserDto,
  User,
  UserProfile,
} from '@org/domain';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: database.DrizzleDB) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: database.eq(database.users.id, id),
    });
    return result as User | null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: database.eq(database.users.email, email),
    });
    return result as User | null;
  }

  async setResetToken(userId: string, token: string, expiresAt: Date) {
    await this.db
      .update(database.users)
      .set({
        resetToken: token,
        resetTokenExpires: expiresAt.toISOString(),
      })
      .where(database.eq(database.users.id, userId));
  }

  async findByResetToken(token: string): Promise<UserProfile | null> {
    const result = await this.db.query.users.findFirst({
      where: database.and(
        database.eq(database.users.resetToken, token),
        database.gt(database.users.resetTokenExpires, new Date().toISOString())
      ),
    });

    return result as UserProfile | null;
  }

  async cleanResetToken(userId: string) {
    await this.db
      .update(database.users)
      .set({
        resetToken: null,
        resetTokenExpires: null,
      })
      .where(database.eq(database.users.id, userId));
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

  async me(userDTO: MeDTO) {
    const user = await this.findByEmail(userDTO.email);
    if (!user) throw new UnauthorizedException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...result } = user;
    return result;
  }

  async update(userId: string, userDto: UpdateUserDto) {
    const [updatedUser] = await this.db
      .update(database.users)
      .set({
        ...userDto,
        updatedAt: new Date().toISOString(),
      })
      .where(database.eq(database.users.id, userId))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...result } = updatedUser;

    return result as UserProfile;
  }

  async updatePassword(userId: string, passwordHash: string) {
    await this.db
      .update(database.users)
      .set({
        passwordHash: passwordHash,
        refreshTokenHash: null,
        updatedAt: new Date().toISOString(),
      })
      .where(database.eq(database.users.id, userId));

    return { success: true, message: 'Password updated successfully' };
  }

  async delete(userId: string) {
    await this.db
      .delete(database.users)
      .where(database.eq(database.users.id, userId));
  }
}
