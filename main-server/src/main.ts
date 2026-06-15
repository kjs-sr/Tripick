import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 클라우드 배포를 위해 모든 도메인 접속 임시 허용
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Render가 제공하는 포트를 사용하거나 기본 3000번 포트 사용
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
