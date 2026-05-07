import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.enableCors({
   origin: [
     'http://localhost:3001',
     'https://sommelier-ia-frontend.vercel.app',
     /\.vercel\.app$/,
   ],
   methods: ['GET', 'POST'],
   credentials: true,
 })

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🍷 Sommelier IA backend corriendo en http://localhost:${port}`);
}

bootstrap();