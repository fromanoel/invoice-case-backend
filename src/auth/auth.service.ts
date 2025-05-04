import { Injectable} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from 'src/errors/unauthorized.error';
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
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
