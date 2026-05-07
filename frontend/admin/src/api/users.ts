import { apiClient } from '../api-client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface User {
  id: number;
  username: string;
  email: string;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  joinDate: string;
  lastLogin: string;
  analysisCount: number;
}

export const usersApi = {
  // 전체 사용자 목록 조회
  getAll: (page = 1, limit = 10, status = ''): Promise<ApiResponse<PaginatedResponse<User>>> => {
    let url = `/admin/users?page=${page}&limit=${limit}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    return apiClient.get<PaginatedResponse<User>>(url);
  },

  // 사용자 정지
  suspend: (userId: number): Promise<ApiResponse<User>> => {
    return apiClient.patch<User>(`/admin/users/${userId}/suspend`);
  },

  // 사용자 정지 해제
  unsuspend: (userId: number): Promise<ApiResponse<User>> => {
    return apiClient.patch<User>(`/admin/users/${userId}/unsuspend`);
  },

  // 사용자 삭제
  delete: (userId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/admin/users/${userId}`);
  },
};
