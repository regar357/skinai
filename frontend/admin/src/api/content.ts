import { apiClient } from '../api-client';
import { Disease, Notice, Hospital, ApiResponse, PaginatedResponse } from '../types';

export const contentApi = {
  // 피부 백과 관련
  diseases: {
    // 피부 백과 목록 조회
    getAll: (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Disease>>> => {
      return apiClient.get<PaginatedResponse<Disease>>(`/diseases?page=${page}&limit=${limit}`);
    },

    // 백과 상세 조회
    getById: (diseaseId: number): Promise<ApiResponse<Disease>> => {
      return apiClient.get<Disease>(`/diseases/${diseaseId}`);
    },

    // 백과 생성 (Admin 기능)
    create: (data: Omit<Disease, 'disease_id' | 'created_at'>): Promise<ApiResponse<Disease>> => {
      return apiClient.post<Disease>('/admin/diseases', data);
    },

    // 백과 수정 (Admin 기능)
    update: (diseaseId: number, data: Partial<Disease>): Promise<ApiResponse<Disease>> => {
      return apiClient.put<Disease>(`/admin/diseases/${diseaseId}`, data);
    },

    // 백과 삭제 (Admin 기능)
    delete: (diseaseId: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<null>(`/admin/diseases/${diseaseId}`);
    },
  },

  // 공지사항 관련
  notices: {
    // 공지사항 목록 조회
    getAll: (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Notice>>> => {
      return apiClient.get<PaginatedResponse<Notice>>(`/notices?page=${page}&limit=${limit}`);
    },

    // 공지사항 상세 조회
    getById: (noticeId: number): Promise<ApiResponse<Notice>> => {
      return apiClient.get<Notice>(`/notices/${noticeId}`);
    },

    // 공지사항 생성 (Admin 기능)
    create: (data: Omit<Notice, 'notice_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Notice>> => {
      return apiClient.post<Notice>('/admin/notices', data);
    },

    // 공지사항 수정 (Admin 기능)
    update: (noticeId: number, data: Partial<Notice>): Promise<ApiResponse<Notice>> => {
      return apiClient.put<Notice>(`/admin/notices/${noticeId}`, data);
    },

    // 공지사항 삭제 (Admin 기능)
    delete: (noticeId: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<null>(`/admin/notices/${noticeId}`);
    },

    // 활성 공지사항만 조회
    getActive: (): Promise<ApiResponse<Notice[]>> => {
      return apiClient.get<Notice[]>('/notices/active');
    },
  },

  // 병원 정보 관련
  hospitals: {
    // 주변 병원 찾기
    search: (params: {
      latitude?: number;
      longitude?: number;
      radius?: number;
      department?: string;
    }): Promise<ApiResponse<Hospital[]>> => {
      const searchParams = new URLSearchParams();
      if (params.latitude) searchParams.append('latitude', params.latitude.toString());
      if (params.longitude) searchParams.append('longitude', params.longitude.toString());
      if (params.radius) searchParams.append('radius', params.radius.toString());
      if (params.department) searchParams.append('department', params.department);

      return apiClient.get<Hospital[]>(`/hospitals?${searchParams.toString()}`);
    },

    // 병원 상세 정보 조회
    getById: (hospitalId: number): Promise<ApiResponse<Hospital>> => {
      return apiClient.get<Hospital>(`/hospitals/${hospitalId}`);
    },

    // 병원 정보 등록 (Admin 기능)
    create: (data: Omit<Hospital, 'hospital_id'>): Promise<ApiResponse<Hospital>> => {
      return apiClient.post<Hospital>('/hospitals', data);
    },

    // 병원 정보 수정 (Admin 기능)
    update: (hospitalId: number, data: Partial<Hospital>): Promise<ApiResponse<Hospital>> => {
      return apiClient.put<Hospital>(`/hospitals/${hospitalId}`, data);
    },

    // 병원 정보 삭제 (Admin 기능)
    delete: (hospitalId: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<null>(`/hospitals/${hospitalId}`);
    },
  },
};
