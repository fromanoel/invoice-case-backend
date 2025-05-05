import { Injectable} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from 'src/errors/unauthorized.error';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly jwtService : JwtService, private readonly prisma: PrismaService,) {}


    async login(user: User): Promise<{ access_token: string; refresh_token: string }> {
        const payload = {
          sub: user.id,
          username: user.username,
          name: user.name,
        };
      
        const accessToken = this.jwtService.sign(payload, {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '15m',
        });
      
        const refreshToken = this.jwtService.sign(
          { sub: user.id, username: user.username },
          {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d',
          },
        );
      
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
      
        await this.prisma.refreshToken.create({
          data: {
            token: refreshToken,
            userId: user.id,
            expiresAt,
          },
        });
      
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
        };
      }
      
   async validateUser(username: string, password: string) {
        const user = await this.userService.findOne(username);

        if(user){
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                return {
                    ...user,
                    password: undefined
                };
            }
        }
        throw new UnauthorizedError('Username or password provided is incorrect.')
    }

    @Cron('0 0 * * *') // Executa diariamente à meia-noite
    async cleanExpiredTokens(): Promise<void> {
      await this.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() }, // Tokens expirados
        },
      });
      console.log('Tokens expirados limpos.');
    }

}
