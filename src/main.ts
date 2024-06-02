import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    // true for all origins
    origin: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
