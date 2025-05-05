import { Controller, HttpCode, HttpStatus, Post, Request, Response, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { UnauthorizedError } from 'src/errors/unauthorized.error';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { cookieConfig } from 'src/config/cookie.config';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest, @Response() res: any) {
    const { access_token, refresh_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, cookieConfig.accessToken);
    res.cookie('refresh_token', refresh_token, cookieConfig.refreshToken);
    return res.send({ message: 'Login successful' });
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }, @Response() res: any) {
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
      await this.prisma.refreshToken.delete({ where: { token: body.refresh_token } });
      throw new UnauthorizedError('Refresh token expired or invalid');
    }

    const newAccessToken = this.jwtService.sign(
      {
        sub: tokenInDb.user.id,
        username: tokenInDb.user.username,
        name: tokenInDb.user.name,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      },
    );

    res.cookie('access_token', newAccessToken, cookieConfig.accessToken);
    return res.send({ message: 'Access token refreshed' });
  }
}
