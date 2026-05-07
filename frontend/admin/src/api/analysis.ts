import { apiClient } from '../api-client';
import { AIAnalysisResult, AnalysisRequest, ApiResponse, PaginatedResponse } from '../types';

export const analysisApi = {
  // AI 분석 요청
  create: (data: AnalysisRequest): Promise<ApiResponse<AIAnalysisResult>> => {
    return apiClient.post<AIAnalysisResult>('/analysis', data);
  },

  // 분석 결과 목록 조회
  getAll: (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<AIAnalysisResult>>> => {
    return apiClient.get<PaginatedResponse<AIAnalysisResult>>(`/analysis?page=${page}&limit=${limit}`);
  },

  // 사용자별 분석 결과 목록 조회
  getUserAnalysis: (userId: number, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<AIAnalysisResult>>> => {
    return apiClient.get<PaginatedResponse<AIAnalysisResult>>(`/analysis/user/${userId}?page=${page}&limit=${limit}`);
  },

  // 분석 결과 상세 조회
  getById: (analysisId: number): Promise<ApiResponse<AIAnalysisResult>> => {
    return apiClient.get<AIAnalysisResult>(`/analysis/${analysisId}`);
  },

  // 분석 결과 삭제
  delete: (analysisId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/analysis/${analysisId}`);
  },

  // 분석 결과 통계 조회 (Admin 기능)
  getStats: (): Promise<ApiResponse<{
    total_analyses: number;
    normal_count: number;
    abnormal_count: number;
    average_confidence: number;
  }>> => {
    return apiClient.get<any>('/analysis/stats');
  },

  // 일별 분석 결과 통계 (Admin 기능)
  getDailyStats: (days = 30): Promise<ApiResponse<Array<{
    date: string;
    count: number;
    normal_count: number;
    abnormal_count: number;
  }>>> => {
    return apiClient.get<any>(`/analysis/stats/daily?days=${days}`);
  },
};
