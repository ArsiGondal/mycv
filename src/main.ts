import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()

    .setTitle('MYCV')
    .setDescription('MYCV APIs')
    .setVersion('1.0')
    .addTag('MYCV APIs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  let port = process.env.port ? process.env.port : 3000;

  await app.listen(process.env.PORT || 3000);

  console.warn(`API is running on port ${port}`);
}
bootstrap();
