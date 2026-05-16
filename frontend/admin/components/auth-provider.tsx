"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authApi } from "@/src/api/auth"

interface AuthContextType {
  isAuthenticated: boolean
  isInitialized: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const ADMIN_AUTH_STATUS_KEY = "skinai_admin_is_authenticated"
const ADMIN_EMAIL_KEY = "skinai_admin_email"
const LEGACY_AUTH_STATUS_KEY = "isAuthenticated"
const LEGACY_EMAIL_KEY = "userEmail"
const LEGACY_NICKNAME_KEY = "userNickname"
const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

type AdminLoginData = {
  access_token?: string
  refresh_token?: string
  accessToken?: string
  refreshToken?: string
  user?: { email?: string }
  data?: AdminLoginData
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem(ADMIN_AUTH_STATUS_KEY)
    const email = localStorage.getItem(ADMIN_EMAIL_KEY)

    localStorage.removeItem(LEGACY_AUTH_STATUS_KEY)
    localStorage.removeItem(LEGACY_EMAIL_KEY)
    localStorage.removeItem(LEGACY_NICKNAME_KEY)
    
    if (authStatus === "true" && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
    }

    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = (await authApi.adminLogin({ email, password })) as AdminLoginData & {
        success?: boolean
      }
      const loginData = response.data || response
      const accessToken = loginData.access_token || loginData.accessToken
      const refreshToken = loginData.refresh_token || loginData.refreshToken
      const userEmail = loginData?.user?.email || email

      if (response.success === false || !accessToken || !refreshToken) {
        return false
      }

      setIsAuthenticated(true)
      setUserEmail(userEmail)
      localStorage.setItem(ADMIN_AUTH_STATUS_KEY, "true")
      localStorage.setItem(ADMIN_EMAIL_KEY, userEmail)
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserEmail(null)
    localStorage.removeItem(ADMIN_AUTH_STATUS_KEY)
    localStorage.removeItem(ADMIN_EMAIL_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(LEGACY_AUTH_STATUS_KEY)
    localStorage.removeItem(LEGACY_EMAIL_KEY)
    localStorage.removeItem(LEGACY_NICKNAME_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
