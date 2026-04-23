"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Set this to true to bypass authentication during development
const BYPASS_AUTH = true

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Skip authentication check during development
    if (BYPASS_AUTH) {
      return
    }
    
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // During development, always render children without authentication check
  if (BYPASS_AUTH) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
