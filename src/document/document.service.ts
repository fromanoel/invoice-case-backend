import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { createWorker } from 'tesseract.js';
import * as path from 'path';

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
    // Extrair o caminho relativo e padronizar as barras
    const relativePath = fullPath.split(path.sep + 'uploads')[1];
    const filePath = path.join('uploads', relativePath).replace(/\\/g, '/'); // Padroniza para barras normais

    return await this.prisma.document.create({
      data: {
        userId,
        originalName,
        filePath,
        extractedText,
      },
    });
  }

    async extractText(imagePath: string): Promise<string> {
      const worker = await createWorker('por', 1, {
        logger: (m) => console.log(m),
      });
  
      try {
        const {
          data: { text },
        } = await worker.recognize(imagePath);
        return text;
      } catch (error) {
        throw error;
      } finally {
        await worker.terminate();
      }
    }

  findAllDocumentsByUserId(userId: string) {
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

  async findDocumentWithInteractions(userId: string, documentId: string) {
    return this.prisma.document.findFirst({
      where: {
        id: documentId,
        userId: userId, // Filtra pelo userId no modelo Document
      },
      include: {
        interactions: true, // Inclui todas as interações relacionadas ao documento
      },
    });
  }

  // findAll() {
  //   return `This action returns all document`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} document`;
  // }

  // update(id: number, updateDocumentDto: UpdateDocumentDto) {
  //   return `This action updates a #${id} document`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} document`;
  // }
}
