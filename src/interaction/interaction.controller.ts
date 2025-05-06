import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  async create(@Req() req: any, @Body() createInteractionDto: CreateInteractionDto) {
    const userId = req.user.id; // Obtém o userId do token JWT
    const { documentId, question } = createInteractionDto;

    // Chama o serviço para criar a interação
    return this.interactionService.createInteraction({
      documentId,
      question,
    });
  }

  // @Get()
  // findAll() {
  //   return this.interactionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.interactionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInteractionDto: UpdateInteractionDto) {
  //   return this.interactionService.update(+id, updateInteractionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.interactionService.remove(+id);
  // }
}
