// 공통 응답 타입
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  timestamp?: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  timestamp?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// 인증 토큰 타입
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// 진단 관련 타입
export interface DiagnosisResponse {
  imagePreview: string
  diagnosisId?: number
  suspectedDisease?: string
  probability?: number
}

export interface ResultData {
  imagePreview: string
  diagnosisId?: number
  suspectedDisease?: string
  probability?: number
}

// 히스토리 관련 타입
export interface HistoryItem {
  id: number
  date: string
  result: string
  score: number
  thumbnail: string
}

// 페이지네이션 공통 타입
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationInfo
}

// 공유 관련 타입
export interface ShareRequest {
  diagnosisId?: number
  title?: string
  text?: string
  url?: string
}

export interface ShareResponse {
  shareUrl: string
  shortUrl?: string
  qrCode?: string
}

// 피드백 관련 타입
export interface FeedbackItem {
  id: number
  userId: number
  userName: string
  userEmail: string
  rating: number
  message: string
  createdAt: string
  status: "pending" | "reviewed" | "resolved"
  adminReply?: string
  adminReplyAt?: string
}

export interface FeedbackRequest {
  rating: number
  message: string
}

// 백엔드 연동용 타입
export interface Diagnosis {
  diagnosisId: number
  imageUrl: string
  result?: {
    suspectedDisease: string
    probability: number
  }
}

export interface EncyclopediaItem {
  id: number
  title: string
  content: string
}

export interface HospitalItem {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  rating: number
  distanceKm: number
  isOpen: boolean
  mapUrl?: string
}

export interface Notice {
  id: number
  title: string
  content: string
  createdAt: string
  date?: string
  type?: "update" | "maintenance" | "feature" | "bug"
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    name: string
    email: string
  }
}
