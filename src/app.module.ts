import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { InteractionModule } from './interaction/interaction.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { ConfigModule } from '@nestjs/config';	

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, UserModule, DocumentModule, InteractionModule, AuthModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'), // Diretório onde os arquivos estão armazenados
    serveRoot: '/uploads', // URL base para acessar os arquivos
  }), ConfigModule.forRoot({isGlobal: true,})],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule {}
