import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  ForgotPasswordDTO,
  LoginDto,
  RegisterDTO,
  ResetPasswordDTO,
  UserProfile,
} from '@org/domain';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Inject } from '@nestjs/common';
import type { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user: UserProfile;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Realiza login e retorna token JWT' })
  @ApiBody({ type: LoginDto })
  async login(
    @Req() req: RequestWithUser,

    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, refresh_token, user } = await this.authService.login(
      req.user
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 hour
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    return { user };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renova o access token usando o refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshToken(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    return { message: 'Tokens refreshed' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Realiza logout limpando os cookies' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiBody({ type: RegisterDTO })
  async register(
    @Body() body: RegisterDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.register(body);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    return { user, access_token };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Esqueceu a senha' })
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reseta a senha' })
  async resetPassword(@Body() body: ResetPasswordDTO) {
    if (body.newPassword !== body.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
