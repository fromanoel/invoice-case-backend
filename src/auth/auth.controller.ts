import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
  Body,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
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

  @Get('verifyToken')
  verifyToken(): string {
    return "Token verified successfully";
  }

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest, @Response() res: any) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );
    res.cookie('access_token', access_token, cookieConfig.accessToken);
    res.cookie('refresh_token', refresh_token, cookieConfig.refreshToken);
    return res.send({ message: 'Login successful' });
  }

@IsPublic()
@Post('logout')
@HttpCode(HttpStatus.OK)
async logout(@Request() req: any, @Response() res: any) {
  try {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not found');
    }

    // Verifica se o refresh token é válido
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const userId = payload.sub;

    // Remove o refresh_token do banco
    await this.authService.logout(userId);

    // Limpa os cookies
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    return res.status(200).send({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Erro no logout:', error);
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}


  @IsPublic()
  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Response({ passthrough: true }) res: any,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não fornecido');
    }

    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenInDb) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
      throw new UnauthorizedException('Refresh token expirado ou inválido');
    }

    const newAccessToken = this.jwtService.sign(
      {
        sub: tokenInDb.user.id,
        username: tokenInDb.user.username,
        name: tokenInDb.user.name,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    res.cookie('access_token', newAccessToken, cookieConfig.accessToken);
    // Retorne apenas o token, sem objetos complexos
    return { access_token: newAccessToken };
  }
}
