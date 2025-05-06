import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseGuards, Request} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthService } from 'src/auth/auth.service'; 
import { cookieConfig } from 'src/config/cookie.config';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, 
  ) {}

  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Response() res: any) {
    // Criar o usuário
    const user = await this.userService.create(createUserDto);
  
    // Logar o usuário automaticamente após a criação
    const { access_token, refresh_token } = await this.authService.login(user);
  
    res.cookie('access_token', access_token, cookieConfig.accessToken);
    res.cookie('refresh_token', refresh_token, cookieConfig.refreshToken);
  
    // Retornar uma mensagem de sucesso 
    return res.send({ message: 'User created and logged in successfully' });
  }

  // @Get(':username')
  // findOne(@Param('username') username: string) {
  //   return this.userService.findOne(username);
  // }

  @Get('me')
  getUser(@Request() req: any) {
    return this.userService.getUser(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}