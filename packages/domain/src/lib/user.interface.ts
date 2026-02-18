import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

export type CreateUserDto = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'passwordHash'
>;

export class RegisterDTO {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'Testing123!@#', description: 'Senha forte' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string;

  @ApiProperty({ example: 'John', description: 'Primeiro nome' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Sobrenome' })
  @IsString()
  @IsNotEmpty({ message: 'O sobrenome é obrigatório' })
  lastName!: string;
}

export type UserProfile = Omit<User, 'passwordHash' | 'refreshTokenHash'>;

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'Testing123!@#', description: 'Senha forte' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;
}

export class MeDTO {
  email!: string;
  userId!: string;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John', description: 'Primeiro nome' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Sobrenome' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL do avatar',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'password123', description: 'Senha atual' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  oldPassword!: string;

  @ApiProperty({ example: 'Testing123!@#', description: 'Senha forte' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  newPassword!: string;

  @ApiProperty({ example: 'Testing123!@#', description: 'Senha forte' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  confirmPassword!: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ example: 'token', description: 'Token de reset' })
  @IsString()
  @IsNotEmpty({ message: 'O token é obrigatório' })
  token!: string;

  @ApiProperty({ example: 'Testing123!@#', description: 'Senha forte' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  newPassword!: string;

  @ApiProperty({ example: 'Testing123!@#', description: 'Senha forte' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  confirmPassword!: string;
}
