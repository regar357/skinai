import { apiClient } from '../api-client';
import { Share, ShareRequest, ApiResponse } from '../types';

export const sharesApi = {
  // 공유 링크 생성
  create: (data: ShareRequest): Promise<ApiResponse<Share>> => {
    return apiClient.post<Share>(`/analysis/${data.analysis_id}/share`, data);
  },

  // 공유 링크 정보 조회
  getByToken: (token: string): Promise<ApiResponse<Share>> => {
    return apiClient.get<Share>(`/shares/${token}`);
  },

  // 공유 링크 삭제
  delete: (shareId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/shares/${shareId}`);
  },

  // 사용자별 공유 링크 목록 조회
  getUserShares: (userId: number): Promise<ApiResponse<Share[]>> => {
    return apiClient.get<Share[]>(`/shares/user/${userId}`);
  },

  // 공유 링크 통계 (Admin 기능)
  getStats: (): Promise<ApiResponse<{
    total_shares: number;
    active_shares: number;
    expired_shares: number;
  }>> => {
    return apiClient.get<any>('/shares/stats');
  },
};
