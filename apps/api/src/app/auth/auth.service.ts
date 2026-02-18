import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO, UserProfile } from '@org/domain';
import { USERS_SERVICE } from '../users/users.constants';
import type { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(USERS_SERVICE) private usersService: UsersService
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<UserProfile | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.passwordHash) {
      const isMatch = await this.comparePassword(password, user.passwordHash);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, refreshTokenHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: UserProfile) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hash = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hash);

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(oldToken: string) {
    try {
      const payload = this.jwtService.verify(oldToken);

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found');

      const isRefreshTokenValid = user.refreshTokenHash
        ? await bcrypt.compare(oldToken, user.refreshTokenHash)
        : false;

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token credential');
      }

      const newPayload = { email: payload.email, sub: payload.sub };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      const newHash = await bcrypt.hash(newRefreshToken, 10);
      await this.usersService.updateRefreshToken(user.id, newHash);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async register(userDto: RegisterDTO) {
    const hashedPassword = await this.hashPassword(userDto.password);

    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.usersService.create({
      ...userDto,
      passwordHash: hashedPassword,
    });

    return this.login(newUser);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const token = uuidv4();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.usersService.setResetToken(user.id, token, expiresAt);

    console.log(
      `Reset Link: http://localhost:3000/reset-password?token=${token}`
    );

    return { message: 'Reset link sent', token: token };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.cleanResetToken(user.id);

    return { success: true };
  }
}
