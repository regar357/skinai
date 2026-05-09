import { apiClient } from '../api-client';
import { Image, ApiResponse } from '../types';

export const imagesApi = {
  // 이미지 업로드 (S3 저장)
  upload: (file: File): Promise<ApiResponse<Image>> => {
    return apiClient.uploadFile('/images', file);
  },

  // 이미지 정보 조회
  getImage: (imageId: number): Promise<ApiResponse<Image>> => {
    return apiClient.get<Image>(`/images/${imageId}`);
  },

  // 사용자별 이미지 목록 조회
  getUserImages: (userId: number): Promise<ApiResponse<Image[]>> => {
    return apiClient.get<Image[]>(`/images/user/${userId}`);
  },

  // 이미지 삭제
  deleteImage: (imageId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/images/${imageId}`);
  },
};
