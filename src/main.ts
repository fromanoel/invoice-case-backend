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
    origin: ['*'],
    methods: ['*'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();