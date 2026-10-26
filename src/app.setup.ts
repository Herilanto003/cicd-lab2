import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CICD Lab 2 API')
    .setDescription("API de démonstration NestJS pour l'atelier CI/CD")
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('hello', 'Message de bienvenue')
    .addTag('health', 'État de santé du service')
    .addTag('version', 'Version du service')
    .addTag('auth', 'Inscription et authentification')
    .addTag('todos', 'Todos de l’utilisateur authentifié')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
