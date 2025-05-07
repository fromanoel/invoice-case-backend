import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Habilitar o cookie-parser
  app.use(cookieParser());

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000',
    'https://invoice-case-backend.onrender.com',
    'https://invoice-case-8ahgoykrp-fernanda-alcantaras-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();