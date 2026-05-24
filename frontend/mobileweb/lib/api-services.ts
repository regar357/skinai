import {
  apiRequest,
  clearStoredTokens,
  setStoredTokens,
} from "@/lib/api-client";

import type {
  AuthResponse,
  Diagnosis,
  EncyclopediaItem,
  FeedbackItem,
  HistoryItem,
  HospitalItem,
  Notice,
  PaginatedResponse,
  ReverseGeocodeResult,
} from "@/types/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  pagination?: {
    page?: number;
    size?: number;
    total?: number;
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
};

export const authService = {
  async login(payload: { email: string; password: string }) {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",

      skipAuth: true,

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),
    });

    setStoredTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return data;
  },

  async signup(payload: { name: string; email: string; password: string }) {
    const data = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",

      skipAuth: true,

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),
    });

    // 회원가입 후 자동 로그인 방지를 위해 토큰 저장 제거
    return data;
  },

  async logout() {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    } finally {
      clearStoredTokens();
    }
  },
};

export const diagnosisService = {
  analyzeImage(formData: FormData) {
    return apiRequest<Diagnosis>("/diagnoses", {
      method: "POST",

      body: formData,
    });
  },

  getHistory(page = 1, size = 5) {
    return apiRequest<PaginatedResponse<HistoryItem>>(
      `/diagnoses/history?page=${page}&size=${size}`,
    );
  },

  getById(diagnosisId: number) {
    return apiRequest<Diagnosis>(`/diagnoses/${diagnosisId}`);
  },

  deleteOne(id: number) {
    return apiRequest<void>(`/diagnoses/${id}`, { method: "DELETE" });
  },

  deleteMany(ids: number[]) {
    return apiRequest<void>("/diagnoses", {
      method: "DELETE",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ ids }),
    });
  },
};

export const profileService = {
  getMyProfile() {
    return apiRequest<{ id: number; name: string; email: string }>("/users/me");
  },

  deleteMyAccount(confirmText: string) {
    return apiRequest<void>("/users/me", {
      method: "DELETE",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ confirmText }),
    });
  },
};

export const noticeService = {
  getNotices(page = 1, size = 5) {
    return apiRequest<PaginatedResponse<Notice> & { total?: number }>(
      `/notices?page=${page}&size=${size}`,
    );
  },

  getNotice(id: number) {
    return apiRequest<Notice>(`/notices/${id}`);
  },

  deleteNotice(id: number) {
    return apiRequest<void>(`/notices/${id}`, { method: "DELETE" });
  },

  createNotice(payload: { title: string; content: string }) {
    return apiRequest<void>("/notices", {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),
    });
  },

  updateNotice(id: number, payload: { title: string; content: string }) {
    return apiRequest<void>(`/notices/${id}`, {
      method: "PUT",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),
    });
  },
};

export const feedbackService = {
  // 사용자용 피드백 기능

  sendFeedback(payload: { rating: number; message: string }) {
    return apiRequest<void>("/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: payload.rating, content: payload.message }),
    });
  },

  async getMyFeedbacks(page = 1, size = 10): Promise<PaginatedResponse<FeedbackItem>> {
    const raw = await apiRequest<any>(`/feedback/my?page=${page}&limit=${size}`);
    const rows: any[] = raw.data ?? raw.items ?? [];
    const pg = raw.pagination ?? {};
    return {
      items: rows.map((f) => ({
        id: f.feedback_id ?? f.id,
        userId: f.user_id ?? f.userId,
        userName: f.user_name ?? "",
        userEmail: f.user_email ?? "",
        rating: f.rating,
        message: f.content ?? f.message ?? "",
        createdAt: f.created_at ?? f.createdAt ?? "",
        status: f.reply_text ? "resolved" : "pending",
        adminReply: f.reply_text ?? undefined,
        adminReplyAt: f.replied_at ?? undefined,
      })),
      pagination: {
        currentPage: pg.page ?? page,
        totalPages: pg.totalPages ?? 1,
        totalItems: pg.total ?? rows.length,
        hasNext: (pg.page ?? page) < (pg.totalPages ?? 1),
        hasPrev: (pg.page ?? page) > 1,
      },
    };
  },

  deleteMyFeedback(id: number) {
    return apiRequest<void>(`/feedback/my/${id}`, { method: "DELETE" });
  },
};

export const encyclopediaService = {
  getEntries(query = "", page = 1, size = 5) {
    const encoded = encodeURIComponent(query);

    return apiRequest<PaginatedResponse<EncyclopediaItem> & { total?: number }>(
      `/encyclopedia?query=${encoded}&page=${page}&size=${size}`,
    );
  },
};

export const hospitalService = {
  async getNearby(params: {
    lat: number;
    lng: number;
    sort?: "distance" | "rating";
    page?: number;
    size?: number;
    address?: string;
  }) {
    const { lat, lng, sort = "distance", page = 1, size = 3, address } = params;
    const searchParams = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      sort,
      page: String(page),
      size: String(size),
    });

    if (address) {
      searchParams.set("address", address);
    }

    const response = await apiRequest<
      PaginatedResponse<HospitalItem> | ApiEnvelope<HospitalItem[]>
    >(`/hospitals/nearby?${searchParams.toString()}`);

    if ("items" in response) {
      return response;
    }

    const totalItems = response.pagination?.total ?? response.data.length;
    const totalPages =
      response.pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / size));
    const currentPage = response.pagination?.page ?? page;

    return {
      items: response.data,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  },

  async reverseGeocode(lat: number, lng: number) {
    const response = await apiRequest<
      ReverseGeocodeResult | ApiEnvelope<ReverseGeocodeResult>
    >(`/hospitals/reverse-geocode?lat=${lat}&lng=${lng}`);

    return "data" in response ? response.data : response;
  },
};
