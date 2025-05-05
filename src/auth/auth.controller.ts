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

  @IsPublic()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any, @Response() res: any) {
    try {
      console.log('Cookies recebidos:', req.cookies);
  
      // Extrair o access_token dos cookies
      const accessToken = req.cookies['access_token'];
  
      if (!accessToken) {
        console.error('Access token não encontrado');
        throw new UnauthorizedError('Access token not found');
      }
  
      // Decodificar o token para obter o userId
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
  
      console.log('Payload decodificado:', payload);
  
      const userId = payload.sub; // O campo `sub` contém o ID do usuário
  
      // Remover todos os refresh tokens do usuário no banco
      await this.authService.logout(userId);
  
      // Limpar os cookies no cliente
      res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'None', domain: 'localhost' });
      res.clearCookie('refresh_token', { httpOnly: true, secure: true, sameSite: 'None', domain: 'localhost' });
  
      return res.send({ message: 'User logged out successfully' });
    } catch (error) {
      console.error('Erro no logout:', error);
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }


  @Post('refresh')
  async refresh(@Request() req: any, @Response({ passthrough: true }) res: any) {
    const refreshToken = req.cookies['refresh_token'];
  
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not provided');
    }
  
    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
  
    if (!tokenInDb) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
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
