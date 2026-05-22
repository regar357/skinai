import { ApiResponse, PaginatedResponse } from "./types";

// API Base Configuration
// 프론트엔드 양식 문서 기준: /api/v1/...
const DEVELOPMENT_API_BASE_URL = "http://localhost:3001/api/v1";
const PRODUCTION_API_BASE_URL = "/api/v1";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? DEVELOPMENT_API_BASE_URL
    : PRODUCTION_API_BASE_URL);

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Get token from localStorage for client-side requests
    let headers = { ...this.defaultHeaders, ...options.headers };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 응답이 JSON이 아닌 경우를 처리
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // HTML 에러 페이지 등 비 JSON 응답 처리
        const text = await response.text();
        if (text.includes("<!DOCTYPE")) {
          // HTML 에러 페이지인 경우
          throw new Error(
            "API 서버에 연결할 수 없습니다. 개발 모드로 동작합니다.",
          );
        } else {
          // 다른 텍스트 응답인 경우
          throw new Error("예상치 못한 응답 형식입니다.");
        }
      }

      if (!response.ok) {
        const errorMessage =
          data.message ||
          (typeof data.error === "string" ? data.error : data.error?.message) ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // 개발 모드에서는 에러 메시지 숨김
      // console.error('API Request Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // File Upload
  async uploadFile(endpoint: string, file: File): Promise<ApiResponse<any>> {
    const url = `${this.baseURL}${endpoint}`;

    const formData = new FormData();
    formData.append("file", file);

    let headers: Record<string, string> = {};

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers = {
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // 개발 모드에서는 에러 메시지 숨김
      // console.error('File Upload Error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for testing
export { ApiClient };
