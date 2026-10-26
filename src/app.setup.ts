import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('CICD Lab 2 API')
    .setDescription("API de démonstration NestJS pour l'atelier CI/CD")
    .setVersion('1.0')
    .addTag('hello', 'Message de bienvenue')
    .addTag('health', 'État de santé du service')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
