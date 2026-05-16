import { apiClient } from '../api-client';
import { ApiResponse } from '../types';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAnalyses: number;
  todayAnalyses: number;
}

export interface DiagnosisTrend {
  month: string;
  value: number;
}

export interface DiseaseDistribution {
  name: string;
  value: number;
  percentage: number;
}

export interface UserTrend {
  month: string;
  active: number;
  new: number;
}

export const dashboardApi = {
  // 대시보드 통계 조회
  getStats: (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<DashboardStats>('/admin/dashboard/stats');
  },

  // 진단 건수 추이 조회
  getDiagnosisTrend: (): Promise<ApiResponse<DiagnosisTrend[]>> => {
    return apiClient.get<DiagnosisTrend[]>('/admin/dashboard/diagnosis-trend');
  },

  // 질환별 분포 조회
  getDiseaseDistribution: (): Promise<ApiResponse<DiseaseDistribution[]>> => {
    return apiClient.get<DiseaseDistribution[]>('/admin/dashboard/disease-distribution');
  },

  // 사용자 추이 조회
  getUserTrend: (): Promise<ApiResponse<UserTrend[]>> => {
    return apiClient.get<UserTrend[]>('/admin/dashboard/user-trend');
  }
};
