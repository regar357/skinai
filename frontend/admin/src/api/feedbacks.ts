import { apiClient } from '../api-client';
import { Feedback, FeedbackRequest, ApiResponse, PaginatedResponse } from '../types';

export const feedbacksApi = {
  // 피드백 작성
  create: (data: FeedbackRequest): Promise<ApiResponse<Feedback>> => {
    return apiClient.post<Feedback>('/feedbacks', data);
  },

  // 피드백 목록 조회
  getAll: (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Feedback>>> => {
    return apiClient.get<PaginatedResponse<Feedback>>(`/feedbacks?page=${page}&limit=${limit}`);
  },

  // 분석 결과별 피드백 조회
  getByAnalysis: (analysisId: number): Promise<ApiResponse<Feedback[]>> => {
    return apiClient.get<Feedback[]>(`/feedbacks/analysis/${analysisId}`);
  },

  // 사용자별 피드백 조회
  getUserFeedbacks: (userId: number): Promise<ApiResponse<Feedback[]>> => {
    return apiClient.get<Feedback[]>(`/feedbacks/user/${userId}`);
  },

  // 피드백 삭제
  delete: (feedbackId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/feedbacks/${feedbackId}`);
  },

  // 피드백 통계 (Admin 기능)
  getStats: (): Promise<ApiResponse<{
    total_feedbacks: number;
    average_rating: number;
    rating_distribution: Record<number, number>;
  }>> => {
    return apiClient.get<any>('/feedbacks/stats');
  },

  };
