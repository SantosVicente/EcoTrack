import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MeDTO, RegisterDTO, UserProfile } from '@org/domain';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(UsersService) private usersService: UsersService
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

  async me(userDTO: MeDTO) {
    const user = await this.usersService.findByEmail(userDTO.email);
    if (!user) throw new UnauthorizedException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...result } = user;
    return result;
  }
}
