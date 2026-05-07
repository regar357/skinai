import { apiClient } from '../api-client';
import { ApiResponse } from '../types';

export interface PerformanceMetric {
  month: string;
  정확도: number;
  정밀도: number;
  재현율: number;
  F1점수: number;
}

export interface DiseaseAccuracy {
  name: string;
  value: number;
}


export interface SystemStatus {
  averageResponseTime: number;
  dailyRequests: number;
  errorRate: number;
  uptime: number;
}

export interface ModelInfo {
  modelVersion: string;
  lastTrained: string;
  dataset: string;
  architecture: string;
  inputSize: string;
  classes: string;
}

export interface SummaryCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  unit: string;
}

export const monitoringApi = {
  // 성능 지표 데이터 조회
  getPerformanceMetrics: (): Promise<ApiResponse<PerformanceMetric[]>> => {
    return apiClient.get<PerformanceMetric[]>('/admin/monitoring/performance');
  },

  // 질병 정확도 데이터 조회
  getDiseaseAccuracy: (): Promise<ApiResponse<DiseaseAccuracy[]>> => {
    return apiClient.get<DiseaseAccuracy[]>('/admin/monitoring/disease-accuracy');
  },

  
  // 시스템 상태 조회
  getSystemStatus: (): Promise<ApiResponse<SystemStatus>> => {
    return apiClient.get<SystemStatus>('/admin/monitoring/system-status');
  },

  // 모델 정보 조회
  getModelInfo: (): Promise<ApiResponse<ModelInfo>> => {
    return apiClient.get<ModelInfo>('/admin/monitoring/model-info');
  }
};
