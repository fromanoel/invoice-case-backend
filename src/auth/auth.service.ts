import { Injectable} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from 'src/errors/unauthorized.error';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly jwtService : JwtService) {}


    login(user: User): { access_token: string; refresh_token: string } {
        const payload: UserPayload = {
            sub: Number(user.id),
            username: user.username,
            name: user.name
        };
    
        const accessToken = this.jwtService.sign(payload, {
            secret: 'ACCESS_TOKEN_SECRET', // ideal: usar via .env
            expiresIn: '15m',
        });
    
        const refreshToken = this.jwtService.sign(
            { sub: user.id, username: user.username },
            {
                secret: 'REFRESH_TOKEN_SECRET',
                expiresIn: '7d',
            },
        );
    
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
        throw new UnauthorizedError('Email address or password provided is incorrect.')
    }

}
