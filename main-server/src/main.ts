import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ★ CORS 설정 추가 (프론트엔드 5173 포트 허용) ★
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // React 앱의 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
