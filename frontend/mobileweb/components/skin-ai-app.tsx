"use client"

import { useState, createContext, useContext } from "react"
import {
  Home,
  History,
  User,
  ScanFace,
  BookOpen,
  MapPin,
  Camera,
} from "lucide-react"
import { SkinLogo } from "@/components/skin-logo"
import { HomePage } from "@/components/home-page"
import { HistoryPage } from "@/components/history-page"
import { ProfilePage } from "@/components/profile-page"
import { ResultPage } from "@/components/result-page"
import { EncyclopediaPage } from "@/components/encyclopedia-page"
import { HospitalFinderPage } from "@/components/hospital-finder-page"
import { AuthPage } from "@/components/auth-page"
import { authService } from "@/lib/api-services"

/* ========== Font Size Context ========== */
type FontSize = "small" | "medium" | "large"

interface FontSizeContextValue {
  fontSize: FontSize
  increase: () => void
  decrease: () => void
  bodyClass: string
}

const fontSizeBodyMap: Record<FontSize, string> = {
  small: "text-base",
  medium: "text-lg",
  large: "text-xl",
}

const FontSizeContext = createContext<FontSizeContextValue | undefined>(undefined)

export function useFontSize() {
  const ctx = useContext(FontSizeContext)
  if (!ctx) throw new Error("useFontSize must be used within SkinAIApp")
  return ctx
}

/* ========== Types ========== */
type TabId = "history" | "profile" | "home" | "encyclopedia" | "hospital"

interface ResultData {
  imagePreview: string
  diagnosisId?: number
  suspectedDisease?: string
  probability?: number
}

interface UserData {
  name: string
  email: string
}

/* ========== Main Component ========== */
export function SkinAIApp() {
  /* Font size state */
  const [fontSize, setFontSize] = useState<FontSize>("medium")
  const increaseFontSize = () => setFontSize((p) => (p === "small" ? "medium" : p === "medium" ? "large" : p))
  const decreaseFontSize = () => setFontSize((p) => (p === "large" ? "medium" : p === "medium" ? "small" : p))

  /* Auth state */
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserData>({ name: "", email: "" })

  /* Navigation state */
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [resultData, setResultData] = useState<ResultData | null>(null)

  /* Handlers */
  const handleLogin = (userData: UserData) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      // API 미연결/실패 시에도 로컬 세션은 종료한다.
    }
    setIsLoggedIn(false)
    setUser({ name: "", email: "" })
    setActiveTab("home")
  }

  const handleAnalysisComplete = (data: ResultData) => {
    setResultData(data)
  }

  const handleBackFromResult = () => {
    setResultData(null)
  }

  const handleFindHospital = () => {
    setResultData(null)
    setActiveTab("hospital")
  }

  const handleProfileUpdate = (data: UserData) => {
    setUser(data)
  }

  const showResult = !!resultData

  /* If not logged in, show full-screen auth */
  if (!isLoggedIn) {
    return (
      <FontSizeContext.Provider
        value={{
          fontSize,
          increase: increaseFontSize,
          decrease: decreaseFontSize,
          bodyClass: fontSizeBodyMap[fontSize],
        }}
      >
        <AuthPage onLogin={handleLogin} />
      </FontSizeContext.Provider>
    )
  }

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        increase: increaseFontSize,
        decrease: decreaseFontSize,
        bodyClass: fontSizeBodyMap[fontSize],
      }}
    >
      <div
        className={`relative z-10 flex min-h-svh flex-col items-center px-4 pb-28 font-sans ${fontSizeBodyMap[fontSize]} ${!showResult && activeTab === "home" ? "pt-8" : "pt-2"}`}
      >
        {/* ===== Top Bar ===== */}
        <header className={`flex w-full max-w-[400px] items-center ${!showResult && activeTab === "home" ? "mb-4" : "mb-4"}`}>
          {!showResult && activeTab === "home" ? (
            // Home page: centered logo
            <div className="flex-1 flex justify-center">
              <SkinLogo />
            </div>
          ) : (
            // Other pages: logo and title text
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <ScanFace className="h-5 w-5 text-white" strokeWidth={1.7} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Skin<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">AI</span>
              </h1>
            </div>
          )}
        </header>

        {/* ===== Page Content ===== */}
        {showResult ? (
          <div key="result" className="flex w-full justify-center">
            <ResultPage
              data={resultData}
              onBack={handleBackFromResult}
              onFindHospital={handleFindHospital}
            />
          </div>
        ) : (
          <div key={activeTab} className="flex w-full justify-center">
            {activeTab === "home" && <HomePage onAnalysisComplete={handleAnalysisComplete} />}
            {activeTab === "history" && <HistoryPage />}
            {activeTab === "profile" && (
              <ProfilePage
                user={user}
                onLogout={handleLogout}
                onProfileUpdate={handleProfileUpdate}
              />
            )}
            {activeTab === "encyclopedia" && <EncyclopediaPage />}
            {activeTab === "hospital" && <HospitalFinderPage />}
          </div>
        )}

        {/* ===== Floating Tab Bar (5 tabs: left 2, center 1 big, right 2) ===== */}
        <nav
          className="animate-float-up fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-end gap-1 rounded-[28px] border border-white/40 bg-white/70 px-2 py-2 shadow-2xl shadow-blue-900/10 backdrop-blur-xl"
          aria-label="Main navigation"
        >
          {/* Left: History */}
          <NavButton
            icon={History}
            label="기록"
            isActive={!showResult && activeTab === "history"}
            onClick={() => {
              if (showResult) setResultData(null)
              setActiveTab("history")
            }}
          />

          {/* Left: Profile */}
          <NavButton
            icon={User}
            label="내 정보"
            isActive={!showResult && activeTab === "profile"}
            onClick={() => {
              if (showResult) setResultData(null)
              setActiveTab("profile")
            }}
          />

          {/* Center: Diagnosis button */}
          <button
            type="button"
            onClick={() => {
              if (showResult) setResultData(null)
              setActiveTab("home")
            }}
            className={`relative flex items-center justify-center rounded-2xl p-2.5 transition-all duration-300 ${
              !showResult && activeTab === "home"
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
            aria-current={!showResult && activeTab === "home" ? "page" : undefined}
            aria-label="진단"
          >
            <Camera className="h-7 w-7" strokeWidth={2} />
            {!showResult && activeTab === "home" && (
              <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
            )}
          </button>

          {/* Right: Encyclopedia */}
          <NavButton
            icon={BookOpen}
            label="백과"
            isActive={!showResult && activeTab === "encyclopedia"}
            onClick={() => {
              if (showResult) setResultData(null)
              setActiveTab("encyclopedia")
            }}
          />

          {/* Right: Hospital */}
          <NavButton
            icon={MapPin}
            label="병원"
            isActive={!showResult && activeTab === "hospital"}
            onClick={() => {
              if (showResult) setResultData(null)
              setActiveTab("hospital")
            }}
          />
        </nav>
      </div>
    </FontSizeContext.Provider>
  )
}

/* ========== NavButton Sub-component ========== */
interface NavButtonProps {
  icon: typeof Home
  label: string
  isActive: boolean
  onClick: () => void
}

function NavButton({ icon: Icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-2xl p-2.5 transition-all duration-300 ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-400 hover:bg-slate-100/60 hover:text-slate-600 active:scale-95"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <Icon className="h-7 w-7" strokeWidth={isActive ? 2 : 1.6} />
      {isActive && (
        <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
      )}
    </button>
  )
}
