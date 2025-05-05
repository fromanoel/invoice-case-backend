import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor (private readonly prisma: PrismaService){}

  
  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const data = {
      ...createUserDto,
      password : await bcrypt.hash(createUserDto.password, 10)
    }

    const createdUser = await this.prisma.user.create({data});
    return { ...createdUser, password: undefined
  };
}




  findAll() {
    return `This action returns all user`;
  }

  async findOneWithPassword(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        password: true, // Inclui o password para validação
        createdAt: true,
      },
    });
  }

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
