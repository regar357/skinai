import { apiClient } from '../api-client';
import { User, AIAnalysisResult, Feedback, ApiResponse, PaginatedResponse } from '../types';

export const adminApi = {
  // 사용자 관리
  users: {
    // 전체 사용자 목록 조회
    getAll: (page = 1, limit = 10, status?: string): Promise<ApiResponse<PaginatedResponse<User>>> => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status', status);
      return apiClient.get<PaginatedResponse<User>>(`/admin/users?${params.toString()}`);
    },

    // 사용자 상세 정보 조회
    getById: (userId: number): Promise<ApiResponse<User>> => {
      return apiClient.get<User>(`/admin/users/${userId}`);
    },

    // 사용자 정지
    suspend: (userId: number): Promise<ApiResponse<User>> => {
      return apiClient.patch<User>(`/admin/users/${userId}/suspend`);
    },

    // 사용자 정지 해제
    unsuspend: (userId: number): Promise<ApiResponse<User>> => {
      return apiClient.patch<User>(`/admin/users/${userId}/unsuspend`);
    },

    // 사용자 통계
    getStats: (): Promise<ApiResponse<{
      total_users: number;
      active_users: number;
      suspended_users: number;
      deleted_users: number;
      new_users_today: number;
      new_users_this_month: number;
    }>> => {
      return apiClient.get<any>('/admin/users/stats');
    },
  },

  // 분석 결과 관리
  analyses: {
    // 전체 분석 결과 목록 조회
    getAll: (page = 1, limit = 10, status?: string): Promise<ApiResponse<PaginatedResponse<AIAnalysisResult>>> => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status', status);
      return apiClient.get<PaginatedResponse<AIAnalysisResult>>(`/admin/analyses?${params.toString()}`);
    },

    // 특정 사용자의 분석 결과 조회
    getUserAnalyses: (userId: number, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<AIAnalysisResult>>> => {
      return apiClient.get<PaginatedResponse<AIAnalysisResult>>(`/admin/users/${userId}/analyses?page=${page}&limit=${limit}`);
    },

    // 분석 결과 삭제
    delete: (analysisId: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<null>(`/admin/analyses/${analysisId}`);
    },

    // 분석 결과 통계
    getStats: (): Promise<ApiResponse<{
      total_analyses: number;
      normal_count: number;
      abnormal_count: number;
      average_confidence: number;
      analyses_today: number;
      analyses_this_month: number;
    }>> => {
      return apiClient.get<any>('/admin/analyses/stats');
    },

    // 질환별 분석 통계
    getDiseaseStats: (): Promise<ApiResponse<Array<{
      disease: string;
      count: number;
      percentage: number;
    }>>> => {
      return apiClient.get<any>('/admin/analyses/disease-stats');
    },
  },

  // 피드백 관리
  feedbacks: {
    // 전체 피드백 목록 조회
    getAll: (page = 1, limit = 10, rating?: number): Promise<ApiResponse<PaginatedResponse<Feedback>>> => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (rating) params.append('rating', rating.toString());
      return apiClient.get<PaginatedResponse<Feedback>>(`/admin/feedbacks?${params.toString()}`);
    },

    // 피드백 삭제
    delete: (feedbackId: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<null>(`/admin/feedbacks/${feedbackId}`);
    },

    // 피드백 통계
    getStats: (): Promise<ApiResponse<{
      total_feedbacks: number;
      average_rating: number;
      rating_distribution: Record<number, number>;
      feedbacks_today: number;
      feedbacks_this_month: number;
    }>> => {
      return apiClient.get<any>('/admin/feedbacks/stats');
    },

    // 관리자 피드백 답변 작성
    reply: (feedbackId: number, replyText: string): Promise<ApiResponse<Feedback>> => {
      return apiClient.post<Feedback>(`/admin/feedbacks/${feedbackId}/reply`, {
        reply_text: replyText
      });
    },
  },

  // 시스템 통계 (대시보드용)
  dashboard: {
    // 대시보드 통계 조회
    getStats: (): Promise<ApiResponse<{
      users: {
        total: number;
        active: number;
        new_today: number;
        new_this_month: number;
      };
      analyses: {
        total: number;
        normal: number;
        abnormal: number;
        today: number;
        this_month: number;
      };
      feedbacks: {
        total: number;
        average_rating: number;
        today: number;
        this_month: number;
      };
      system: {
        uptime: number;
        memory_usage: number;
        cpu_usage: number;
        storage_usage: number;
      };
    }>> => {
      return apiClient.get<any>('/admin/dashboard/stats');
    },

    // 일별 활동 통계
    getDailyActivity: (days = 30): Promise<ApiResponse<Array<{
      date: string;
      new_users: number;
      analyses: number;
      feedbacks: number;
    }>>> => {
      return apiClient.get<any>(`/admin/dashboard/daily-activity?days=${days}`);
    },
  },

  // 시스템 관리
  system: {
    // 시스템 상태 조회
    getStatus: (): Promise<ApiResponse<{
      status: 'healthy' | 'warning' | 'error';
      database: 'connected' | 'disconnected';
      storage: 'available' | 'full' | 'warning';
      ai_service: 'available' | 'unavailable';
      last_backup: string;
    }>> => {
      return apiClient.get<any>('/admin/system/status');
    },

    // 로그 조회
    getLogs: (level = 'info', page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<{
      log_id: number;
      level: string;
      message: string;
      created_at: string;
      user_id?: number;
    }>>> => {
      return apiClient.get<PaginatedResponse<any>>(`/admin/system/logs?level=${level}&page=${page}&limit=${limit}`);
    },

    // 백업 생성
    createBackup: (): Promise<ApiResponse<{
      backup_id: string;
      created_at: string;
      size: number;
    }>> => {
      return apiClient.post<any>('/admin/system/backup');
    },
  },
};
