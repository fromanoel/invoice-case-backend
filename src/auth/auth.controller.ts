import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { UnauthorizedError } from 'src/errors/unauthorized.error';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly userService : UserService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    try {
      const payload = this.jwtService.verify(body.refresh_token, {
        secret: 'REFRESH_TOKEN_SECRET',
      });

      const user = await this.userService.findOne(payload.username);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: user.id,
          username: user.username,
          name: user.name,
        },
        {
          secret: 'ACCESS_TOKEN_SECRET',
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}
