import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MeDTO, UpdatePasswordDto, UpdateUserDto } from '@org/domain';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

interface RequestWithMe extends Request {
  user: MeDTO;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna as informações do usuário autenticado' })
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: RequestWithMe) {
    return this.usersService.me(req.user);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza as informações do usuário autenticado' })
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() req: RequestWithMe, @Body() body: UpdateUserDto) {
    return this.usersService.update(req.user.userId, body);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Deleta o usuário autenticado' })
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() req: RequestWithMe) {
    return this.usersService.delete(req.user.userId);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Atualiza a senha do usuário autenticado' })
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(
    @Req() req: RequestWithMe,
    @Body() body: UpdatePasswordDto
  ) {
    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new UnauthorizedException('User not found');

    const isOldPasswordCorrect = await bcrypt.compare(
      body.oldPassword,
      user.passwordHash
    );
    if (!isOldPasswordCorrect) {
      throw new UnauthorizedException('Wrong current password');
    }

    const newHash = await bcrypt.hash(body.newPassword, 10);

    return this.usersService.updatePassword(req.user.userId, newHash);
  }
}
