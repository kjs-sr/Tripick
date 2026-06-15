import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  // 환경변수에 AI_SERVER_URL이 있으면 그걸 쓰고, 없으면 로컬(127.0.0.1)을 씁니다.
  private get baseUrl(): string {
    return process.env.AI_SERVER_URL || 'http://127.0.0.1:8000';
  }

  // 자동완성 검색을 AI 서버로 넘겨줌
  async searchTitles(category: string, query: string): Promise<any> {
    try {
      const aiServerUrl = `${this.baseUrl}/search/${category}?query=${encodeURIComponent(query)}`;
      const response = await fetch(aiServerUrl);
      return await response.json();
    } catch (error) {
      console.error(error);
      return { status: 'fail', data: [] };
    }
  }

  // 필터, 제외 목록, 강도, 그리고 정확한 매칭을 위한 타겟 ID까지 모두 AI 서버로 넘겨줌
  async getRecommendation(
    category: string,
    query: string,
    mode: string,
    simTier: number,
    recTier: number,
    limit: number,
    filters?: string,
    excludes?: string,
    targetId?: string, // 추가: 고유 식별자 수신
  ): Promise<any> {
    try {
      let aiServerUrl = `${this.baseUrl}/recommend/${category}?query=${encodeURIComponent(query)}&mode=${mode}&sim_tier=${simTier}&rec_tier=${recTier}&limit=${limit}`;

      if (filters) aiServerUrl += `&filters=${encodeURIComponent(filters)}`;
      if (excludes) aiServerUrl += `&excludes=${encodeURIComponent(excludes)}`;
      if (targetId) aiServerUrl += `&target_id=${encodeURIComponent(targetId)}`; // ID 쿼리 파라미터 추가

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
      const response = await fetch(`${this.baseUrl}/metadata`);
      return await response.json();
    } catch (error) {
      console.error('Metadata 로드 에러:', error);
      return { status: 'fail' };
    }
  }
}
