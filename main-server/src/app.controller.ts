import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. 자동완성 검색용 엔드포인트
  @Get('search')
  async searchTitles(
    @Query('category') category: string,
    @Query('query') query: string,
  ) {
    if (!category || !query) return { status: 'fail' };
    return await this.appService.searchTitles(category, query);
  }

  // 2. 메인 추천용 엔드포인트
  @Get('recommend')
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

  @Get('metadata')
  async getMetadata() {
    return await this.appService.getMetadata();
  }
}
