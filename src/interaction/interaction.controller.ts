import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @IsPublic()
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.createInteraction(createInteractionDto);
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
