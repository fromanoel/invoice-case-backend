import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          callback(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async handleImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file || !file.path) {
      throw new Error('Arquivo não enviado corretamente.');
    }

    const text = await this.documentService.extractText(file.path);
    const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
    const finalPath = path.join(uploadsDir, file.filename);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.renameSync(file.path, finalPath);
    const invoice = await this.documentService.saveDocument(finalPath, file.originalname, req, text);
    return {
      id: invoice.id,
      extractedText: text,
      imagePath: `/uploads/images/${file.filename}`,
    };
  }


  @Get()
  async findAllDocumentsByUserId(@Req() req: any) {
    const userId = req.user.id;
    const documents =
      await this.documentService.findAllDocumentsByUserId(userId);
    return documents;
  }

  @Get(':id/interaction')
  async findDocumentWithInteractions(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const document = await this.documentService.findDocumentWithInteractions(
      userId,
      id,
    );
    return document;
  }
}
// @Get()
// findAll() {
//   return this.documentService.findAll();
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.documentService.findOne(+id);
// }

// @Patch(':id')
// update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
//   return this.documentService.update(+id, updateDocumentDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.documentService.remove(+id);
// }
