import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = await app.get(ConfigService);
  const port = config.get('API_PORT');
  await app.listen(port || 3000, () => {
    console.log(`App started on port ${port}`);
  });
}
bootstrap();
