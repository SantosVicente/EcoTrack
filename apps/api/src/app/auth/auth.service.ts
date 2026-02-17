import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserProfile } from '@org/domain';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
    const mockUser: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      passwordHash:
        '$2b$10$q0.wfYhfmdSpwnGXauKXBe6mm.paJ2SPtfM3ot444D1POdZBwkDFq',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (mockUser && mockUser.email === email) {
      const isMatch = await this.comparePassword(
        password,
        mockUser.passwordHash
      );
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, refreshTokenHash, ...result } = mockUser;
        return result;
      }
    }
    return null;
  }

  async login(user: UserProfile) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
