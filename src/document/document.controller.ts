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
import { createWorker } from 'tesseract.js';
import { diskStorage } from 'multer';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/tmp',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        callback(null, `${name}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async handleImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file || !file.path) {
      throw new Error('Arquivo não enviado corretamente.');
    }
  
    const text = await this.extractText(file.path);
    console.log('Texto extraído:', text);
    const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
    const finalPath = path.join(uploadsDir, file.filename);
  
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  
    fs.renameSync(file.path, finalPath);
    this.documentService.saveDocument(finalPath, file.originalname, req, text);
    return {
      extractedText: text,
      imagePath: `/uploads/images/${file.filename}`,
    };
  }

  async extractText(imagePath: string): Promise<string>{
    const worker = await createWorker('por', 1, {
      logger: m => console.log(m), 
    });
    
    try {
  
      const { data: { text } } = await worker.recognize(imagePath);
      console.log('Texto extraído:', text);
      return text;
    } catch (error) {
      console.error('Erro ao extrair texto:', error);
      throw error;
    } finally {
      await worker.terminate();
    }
}

@Get()
async findAllDocumentsByUserId(@Req() req: any) {
  const userId = req.user.id; 
  const documents = await this.documentService.findAllDocumentsByUserId(userId);
  console.log(documents);
  return documents;
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
