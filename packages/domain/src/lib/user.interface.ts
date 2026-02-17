import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  avatarUrl?: string;
  refreshTokenHash?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserDto = Pick<User, 'email' | 'firstName' | 'lastName'> & {
  password: string;
};

export type UserProfile = Omit<User, 'passwordHash' | 'refreshTokenHash'>;

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;
}
