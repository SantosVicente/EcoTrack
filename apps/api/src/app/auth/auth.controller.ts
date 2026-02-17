import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto, UserProfile } from '@org/domain';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: UserProfile;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Realiza login e retorna token JWT' })
  @ApiBody({ type: LoginDto })
  async login(@Req() req: RequestWithUser, @Body() body: LoginDto) {
    console.log(body);
    console.log(req.user);
    return this.authService.login(req.user);
  }
}
