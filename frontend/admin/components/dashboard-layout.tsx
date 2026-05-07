"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { DashboardContent } from "./dashboard-content"
import { UsersPage } from "./users-page"
import { RecordsPage } from "./records-page"
import { FeedbackPage } from "./feedback-page"
import { EncyclopediaPage } from "./encyclopedia-page"
import { AIMonitoringPage } from "@/components/AIMonitoringPage"

const menuTitles: Record<string, string> = {
  dashboard: "대시보드",
  users: "사용자 관리",
  records: "검사 기록",
  feedback: "피드백",
  encyclopedia: "피부종양 백과",
  monitoring: "AI 진단 모니터링",
}

function PageContent({ activeMenu }: { activeMenu: string }) {
  switch (activeMenu) {
    case "dashboard":
      return <DashboardContent />
    case "users":
      return <UsersPage />
    case "records":
      return <RecordsPage />
    case "feedback":
      return <FeedbackPage />
    case "encyclopedia":
      return <EncyclopediaPage />
    case "monitoring":
      return <AIMonitoringPage />
    default:
      return (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <p className="text-sm text-gray-400">
            {menuTitles[activeMenu]} 페이지 준비 중입니다.
          </p>
        </div>
      )
  }
}

export function DashboardLayout() {
  const [activeMenu, setActiveMenu] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header title={menuTitles[activeMenu]} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <PageContent activeMenu={activeMenu} />
        </main>
      </div>
    </div>
  )
}
