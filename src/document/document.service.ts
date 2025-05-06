import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async saveDocument(
    fullPath: string,
    originalName: string,
    @Request() req: any,
    extractedText: string,
  ) {
    const userId = req.user.id;
    const relativePath = fullPath.split('\\uploads')[1];
    const filePath = `\\uploads${relativePath}`; //
    console.log(filePath);
    console.log(originalName);
    console.log(userId);

    await this.prisma.document.create({
      data: {
        userId,
        originalName,
        filePath,
        extractedText
      }
    })
  }

  findAllDocumentsByUserId(userId: string){
    return this.prisma.document.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalName: true,
        filePath: true,
        extractedText: true,
        createdAt: true,
      },
    });
  }

  findAll() {
    return `This action returns all document`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
