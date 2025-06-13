import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
      timestamp: true,
      context: 'UserService',
      logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
    }),
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('API documentation for the User Service')
    .setVersion('1.0')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
