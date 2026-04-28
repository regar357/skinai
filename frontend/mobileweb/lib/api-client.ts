import type { ApiErrorResponse, AuthTokens } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1"
const ACCESS_TOKEN_KEY = "skinai_access_token"
const REFRESH_TOKEN_KEY = "skinai_refresh_token"

function getStoredTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!accessToken || !refreshToken) return null
  return { accessToken, refreshToken }
}

export function setStoredTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearStoredTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

type ApiRequestOptions = RequestInit & { skipAuth?: boolean }

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth, headers, ...restOptions } = options
  const token = getStoredTokens()?.accessToken

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...(headers || {}),
      ...(skipAuth ? {} : token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    let error: ApiErrorResponse = {
      code: `HTTP_${response.status}`,
      message: "요청 처리 중 오류가 발생했습니다.",
    }

    try {
      const parsed = (await response.json()) as ApiErrorResponse
      if (parsed?.message) error = parsed
    } catch {
      // Keep default error shape when server doesn't return JSON.
    }

    throw new Error(error.message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
