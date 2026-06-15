import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

// 기존 @Controller('api') 였던 것을 분리하여 루트 경로 접속 시 404 방지
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 기본 주소("/")로 접속했을 때 뜨는 환영 메시지
  @Get()
  getHello() {
    return {
      status: 'success',
      message:
        '🚀 Tripick 메인 서버(NestJS)가 클라우드에서 정상 가동 중입니다!',
    };
  }

  // --- 아래부터는 프론트엔드가 호출할 /api/... 엔드포인트들 ---

  // 필터 기준값 메타데이터 로드 (누락되었던 부분 추가!)
  @Get('api/metadata')
  async getMetadata() {
    return await this.appService.getMetadata();
  }

  // 1. 자동완성 검색용 엔드포인트
  @Get('api/search')
  async searchTitles(
    @Query('category') category: string,
    @Query('query') query: string,
  ) {
    if (!category || !query) return { status: 'fail' };
    return await this.appService.searchTitles(category, query);
  }

  // 2. 메인 추천용 엔드포인트
  @Get('api/recommend')
  async getRecommendation(
    @Query('category') category: string,
    @Query('query') query: string,
    @Query('mode') mode: string = 'custom',
    @Query('sim_tier') simTier: string = '6',
    @Query('rec_tier') recTier: string = '6',
    @Query('limit') limit: string = '15',
    @Query('filters') filters: string,
    @Query('excludes') excludes: string,
  ) {
    if (!category || !query) {
      return {
        status: 'fail',
        message: '카테고리와 검색어를 모두 입력해주세요.',
      };
    }

    return await this.appService.getRecommendation(
      category,
      query,
      mode,
      Number(simTier),
      Number(recTier),
      Number(limit),
      filters,
      excludes,
    );
  }
}
