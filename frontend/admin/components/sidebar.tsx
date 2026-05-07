"use client"

import { useState } from "react"
import {
  LayoutGrid,
  Users,
  Clock,
  MessageSquare,
  BookOpen,
  Activity,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "대시보드", icon: <LayoutGrid className="h-5 w-5" /> },
  { id: "users", label: "사용자 관리", icon: <Users className="h-5 w-5" /> },
  { id: "records", label: "검사 기록", icon: <Clock className="h-5 w-5" /> },
  { id: "feedback", label: "피드백", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "encyclopedia", label: "피부종양 백과", icon: <BookOpen className="h-5 w-5" /> },
  { id: "monitoring", label: "AI 진단 모니터링", icon: <Activity className="h-5 w-5" /> },
]

interface SidebarProps {
  activeMenu: string
  onMenuChange: (menuId: string) => void
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-gray-900">SkinAI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onMenuChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeMenu === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span
                  className={cn(
                    activeMenu === item.id ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
