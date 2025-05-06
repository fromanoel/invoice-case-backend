import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import OpenAI from 'openai';
import fs from 'fs/promises';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InteractionService {
  private readonly openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY});
  }

  async createInteraction({ documentId, question}: CreateInteractionDto) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { extractedText: true }
    });

    if (!document || !document.extractedText) {
      throw new Error('Documento não encontrado ou sem texto extraído.');
    }

    const baseText = document.extractedText;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Você é um assistente de Ia que entende o seguinte texto base e resposta perguntas sobre ele:\n]n${baseText}`},
        {
          role: 'user',
          content: question
        }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const answer = completion.choices[0].message.content ?? '';
    const interaction = await this.prisma.interaction.create({
      data: {
        documentId,
        question,
        answer
      }
    });

    return interaction;
  }
  }


//   import fs from "fs/promises";
// import OpenAI from "openai";
// const client = new OpenAI();

// const instructions = await fs.readFile("prompt.txt", "utf-8");

// const response = await client.responses.create({
//     model: "gpt-4.1",
//     instructions,
//     input: "How would I declare a variable for a last name?",
// });

// console.log(response.output_text);
//   findAll() {
//     return `This action returns all interaction`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} interaction`;
//   }

//   update(id: number, updateInteractionDto: UpdateInteractionDto) {
//     return `This action updates a #${id} interaction`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} interaction`;
//   }
// }
