import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173'
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
      transformOptions:{
        enableImplicitConversion:true
      }
    })
  )
  app.useStaticAssets(
    join(process.cwd(), 'uploads'),
    {prefix:'/uploads'}
  )
  app.enableShutdownHooks()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
