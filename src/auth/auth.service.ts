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


    login(user: User) : UserToken {
        //Transforma USER em JWT
        const payload: UserPayload = {
            sub: Number(user.id),
            username: user.username,
            name: user.name
        };

        const jwtToken = this.jwtService.sign(payload);

        return { access_token : jwtToken}
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
