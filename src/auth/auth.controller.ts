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
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly userService : UserService, private readonly prisma : PrismaService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { token: body.refresh_token },
      include: { user: true },
    });
  
    if (!tokenInDb) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  
    try {
      this.jwtService.verify(body.refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      // opcional: remover o token expirado do banco
      await this.prisma.refreshToken.delete({ where: { token: body.refresh_token } });
      throw new UnauthorizedError('Refresh token expired or invalid');
    }
  
    const newAccessToken = this.jwtService.sign({
      sub: tokenInDb.user.id,
      username: tokenInDb.user.username,
      name: tokenInDb.user.name,
    }, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });
  
    return { access_token: newAccessToken };
  }
  
}
