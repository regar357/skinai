import type { ApiErrorResponse, AuthTokens } from "@/types/api";

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";
const ACCESS_TOKEN_KEY = "skinai_access_token";
const REFRESH_TOKEN_KEY = "skinai_refresh_token";

function getStoredTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setStoredTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearStoredTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

type ApiRequestOptions = RequestInit & { skipAuth?: boolean };

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { skipAuth, headers, ...restOptions } = options;
  const token = getStoredTokens()?.accessToken;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
      headers: {
        ...(headers || {}),
        ...(skipAuth ? {} : token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    throw new NetworkError(
      `백엔드 서버에 연결할 수 없습니다. (${err instanceof Error ? err.message : String(err)})`,
    );
  }

  if (!response.ok) {
    let error: ApiErrorResponse = {
      success: false,
      error: {
        code: `HTTP_${response.status}`,
        message: `서버 연결 오류 (${response.status}). 백엔드 서버가 실행 중인지 확인하세요.`,
      },
    };

    try {
      const parsed = (await response.json()) as any;
      const msg = parsed?.error?.message || parsed?.message;
      if (msg) error = { success: false, error: { code: `HTTP_${response.status}`, message: msg } };
    } catch {
      // Keep default error shape when server doesn't return JSON.
    }

    throw new ApiError(error.error.message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
