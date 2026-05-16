import { apiClient } from '../api-client';
import { User, LoginRequest, LoginResponse, SignupRequest, ApiResponse } from '../types';

export const authApi = {
  // 회원 가입
  signup: (data: SignupRequest): Promise<ApiResponse<User>> => {
    return apiClient.post<User>('/auth/signup', data);
  },

  // 일반 사용자 로그인
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  // 관리자 로그인
  adminLogin: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>('/admin/login', data);
  },

  // 로그아웃
  logout: (): Promise<ApiResponse<null>> => {
    return apiClient.post<null>('/auth/logout');
  },

  // 현재 사용자 정보 조회
  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/users/me');
  },

  // 회원 탈퇴
  deleteUser: (userId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/users/${userId}`);
  },
};
