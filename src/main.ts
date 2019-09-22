import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(AppModule.port);  
  
  console.log(`Server running on http://localhost:${AppModule.port}/api`);
}

bootstrap();
