import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  // 자동완성 검색을 AI 서버로 넘겨줌
  async searchTitles(category: string, query: string): Promise<any> {
    try {
      const aiServerUrl = `http://127.0.0.1:8000/search/${category}?query=${encodeURIComponent(query)}`;
      const response = await fetch(aiServerUrl);
      return await response.json();
    } catch (error) {
      console.error(error);
      return { status: 'fail', data: [] };
    }
  }

  // 필터, 제외 목록, 강도를 모두 묶어서 AI 서버로 넘겨줌
  async getRecommendation(
    category: string,
    query: string,
    mode: string,
    simTier: number,
    recTier: number,
    limit: number,
    filters?: string,
    excludes?: string,
  ): Promise<any> {
    try {
      let aiServerUrl = `http://127.0.0.1:8000/recommend/${category}?query=${encodeURIComponent(query)}&mode=${mode}&sim_tier=${simTier}&rec_tier=${recTier}&limit=${limit}`;

      if (filters) aiServerUrl += `&filters=${encodeURIComponent(filters)}`;
      if (excludes) aiServerUrl += `&excludes=${encodeURIComponent(excludes)}`;

      const response = await fetch(aiServerUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'AI 서버 통신 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMetadata(): Promise<any> {
    try {
      const response = await fetch('http://127.0.0.1:8000/metadata');
      return await response.json();
    } catch (error) {
      console.error('Metadata 로드 에러:', error);
      return { status: 'fail' };
    }
  }
}
