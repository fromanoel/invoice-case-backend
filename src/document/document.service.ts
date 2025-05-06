import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async saveFilePath(filePath: string, originalName: string) {
    console.log(`Salvando no banco: ${filePath} (${originalName})`);
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
