import { apiRequest, clearStoredTokens, setStoredTokens } from "@/lib/api-client"

import type {

  AuthResponse,

  Diagnosis,

  EncyclopediaItem,

  FeedbackItem,

  HistoryItem,

  HospitalItem,

  Notice,

  PaginatedResponse,

} from "@/types/api"



export const authService = {

  async login(payload: { email: string; password: string }) {

    const data = await apiRequest<AuthResponse>("/auth/login", {

      method: "POST",

      skipAuth: true,

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

    })

    setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })

    return data

  },

  async signup(payload: { name: string; email: string; password: string }) {

    const data = await apiRequest<AuthResponse>("/auth/signup", {

      method: "POST",

      skipAuth: true,

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

    })

    setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })

    return data

  },

  async logout() {

    try {

      await apiRequest<void>("/auth/logout", { method: "POST" })

    } finally {

      clearStoredTokens()

    }

  },

}



export const diagnosisService = {

  analyzeImage(formData: FormData) {

    return apiRequest<Diagnosis>("/diagnoses", {

      method: "POST",

      body: formData,

    })

  },

  getHistory(page = 1, size = 5) {

    return apiRequest<PaginatedResponse<HistoryItem>>(`/diagnoses/history?page=${page}&size=${size}`)

  },

  getById(diagnosisId: number) {

    return apiRequest<Diagnosis>(`/diagnoses/${diagnosisId}`)

  },

  deleteOne(id: number) {

    return apiRequest<void>(`/diagnoses/${id}`, { method: "DELETE" })

  },

  deleteMany(ids: number[]) {

    return apiRequest<void>("/diagnoses", {

      method: "DELETE",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ ids }),

    })

  },

}



export const profileService = {

  getMyProfile() {

    return apiRequest<{ id: number; name: string; email: string }>("/users/me")

  },

  deleteMyAccount(confirmText: string) {

    return apiRequest<void>("/users/me", {

      method: "DELETE",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ confirmText }),

    })

  },

}



export const noticeService = {

  getNotices(page = 1, size = 5) {

    return apiRequest<PaginatedResponse<Notice>>(`/notices?page=${page}&size=${size}`)

  },

  getNotice(id: number) {

    return apiRequest<Notice>(`/notices/${id}`)

  },

  deleteNotice(id: number) {

    return apiRequest<void>(`/notices/${id}`, { method: "DELETE" })

  },

  createNotice(payload: { title: string; content: string }) {

    return apiRequest<void>("/notices", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

    })

  },

  updateNotice(id: number, payload: { title: string; content: string }) {

    return apiRequest<void>(`/notices/${id}`, {

      method: "PUT",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

    })

  },

}



export const feedbackService = {

  // 사용자용 피드백 기능

  sendFeedback(payload: { rating: number; message: string }) {

    return apiRequest<void>("/feedback", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),

    })

  },

  getMyFeedbacks(page = 1, size = 10) {

    return apiRequest<PaginatedResponse<FeedbackItem>>(`/feedback/my?page=${page}&size=${size}`)

  },

  deleteMyFeedback(id: number) {

    return apiRequest<void>(`/feedback/my/${id}`, { method: "DELETE" })

  },

}



export const encyclopediaService = {

  getEntries(query = "", page = 1, size = 5) {

    const encoded = encodeURIComponent(query)

    return apiRequest<PaginatedResponse<EncyclopediaItem>>(

      `/encyclopedia?query=${encoded}&page=${page}&size=${size}`,

    )

  },

}



export const hospitalService = {

  getNearby(params: { lat: number; lng: number; sort?: "distance" | "rating"; page?: number; size?: number }) {

    const { lat, lng, sort = "distance", page = 1, size = 3 } = params

    return apiRequest<PaginatedResponse<HospitalItem>>(

      `/hospitals/nearby?lat=${lat}&lng=${lng}&sort=${sort}&page=${page}&size=${size}`,

    )

  },

}

