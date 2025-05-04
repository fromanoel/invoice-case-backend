import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { InteractionModule } from './interaction/interaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, DocumentModule, InteractionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
