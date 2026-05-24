// API Response Types based on api-spec.md

// DB 명세에 따른 사용자 상태 타입
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export interface User {
  user_id: number;
  email: string;
  nickname: string;
  status: UserStatus;
  created_at: string;
}

export interface AIAnalysisResult {
  analysis_id: number;
  image_id: number;
  user_id: number;
  result_status: "NORMAL" | "ABNORMAL";
  suspected_disease: string;
  confidence_score: number;
  guide_text: string;
  created_at: string;
}

// 검사기록 탭에 맞는 타입
export interface ExamRecord {
  id: number;
  username: string;
  userId: string;
  examDate: string;
  examType: string;
  result: string;
  confidence: number;
  imageId: string;
}

// 검사기록 탭에 맞는 타입
export interface ExamRecord {
  id: number;
  username: string;
  userId: string;
  examDate: string;
  examType: string;
  result: string;
  confidence: number;
  imageId: string;
}

export interface Image {
  image_id: number;
  user_id: number;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface Feedback {
  feedback_id: number;
  user_id: number;
  analysis_id: number;
  content: string;
  rating: number;
  status: "pending" | "answered";
  status: "pending" | "answered";
  created_at: string;
  admin_reply?: string;
  admin_reply?: string;
}

export interface Disease {
  id: number;
  title: string;
  id: number;
  title: string;
  description: string;
  modifiedDate: string;
}

export interface Article {
  article_id?: number;
  id?: number;
  title: string;
  content: string;
  category?: string;
  image_url?: string;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Notice {
  notice_id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hospital {
  hospital_id: number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  department: string;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AnalysisRequest {
  image_id: number;
}

export interface FeedbackRequest {
  analysis_id: number;
  content: string;
  rating: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
