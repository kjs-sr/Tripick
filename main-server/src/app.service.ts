import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  // Render 환경변수(AI_SERVER_URL)를 유연하게 가져오고, 없으면 로컬 주소를 기본값으로 사용합니다.
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

  // 필터, 제외 목록, 강도, 그리고 정확한 고유 ID(target_id)까지 모두 묶어서 AI 서버로 안전하게 전달합니다.
  async getRecommendation(
    category: string,
    query: string,
    mode: string,
    simTier: number,
    recTier: number,
    limit: number,
    filters?: string,
    excludes?: string,
    targetId?: string, // target_id 추가
  ): Promise<any> {
    try {
      let aiServerUrl = `${this.baseUrl}/recommend/${category}?query=${encodeURIComponent(query)}&mode=${mode}&sim_tier=${simTier}&rec_tier=${recTier}&limit=${limit}`;

      if (filters) aiServerUrl += `&filters=${encodeURIComponent(filters)}`;
      if (excludes) aiServerUrl += `&excludes=${encodeURIComponent(excludes)}`;
      if (targetId) aiServerUrl += `&target_id=${encodeURIComponent(targetId)}`; // AI 서버 쿼리 스트링에 결합

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

  // 클라우드 환경에 맞게 하드코딩을 제거하고 메타데이터 API 주소를 변환합니다.
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
