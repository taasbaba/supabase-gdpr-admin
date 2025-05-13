import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for swagger
  const config = new DocumentBuilder()
    .setTitle('Supabase Auth API')
    .setDescription('Private API for authenticated users')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer token support
    .build();

  // for swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors(); // Supabase email redirection usually involves cross-origin (CORS) issues
  await app.listen(process.env.PORT || 5678);
}
bootstrap();
