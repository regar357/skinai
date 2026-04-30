"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")
    
    if (authStatus === "true" && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    if (email === "admin@skinai.com" && password === "admin123") {
      setIsAuthenticated(true)
      setUserEmail(email)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserEmail(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
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
