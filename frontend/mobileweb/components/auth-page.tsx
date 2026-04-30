"use client"

import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, Loader2, ScanFace, Sparkles } from "lucide-react"
import { authService } from "@/lib/api-services"

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    try {
      const data =
        mode === "login"
          ? await authService.login({
              email: form.email,
              password: form.password,
            })
          : await authService.signup({
              name: form.name,
              email: form.email,
              password: form.password,
            })

      onLogin({
        name: data.user.name || form.name || "사용자",
        email: data.user.email || form.email || "user@skinai.com",
      })
    } catch {
      // 백엔드 미연결 상태에서도 기존 목업 UX를 유지한다.
      onLogin({
        name: form.name || "사용자",
        email: form.email || "user@skinai.com",
      })
      setErrorMessage("백엔드 연결 전이라 목업 로그인으로 진입했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob-1 absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="animate-blob-2 absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />
        <div className="animate-blob-3 absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center gap-8">
        {/* Logo and branding */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30">
            <ScanFace className="h-10 w-10 text-white" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">SkinAI</h1>
            <p className="mt-1 text-base text-muted-foreground">AI 기반 피부 진단 서비스</p>
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full rounded-[28px] border border-white/50 bg-white/70 p-8 shadow-2xl shadow-blue-200/20 backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              {mode === "login" ? "로그인" : "회원가입"}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="이름"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-4 text-base font-medium text-foreground placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            )}

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                placeholder="이메일"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-4 text-lg font-medium text-foreground placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-12 text-lg font-medium text-foreground placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 py-4 text-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  처리 중...
                </>
              ) : mode === "login" ? (
                "로그인"
              ) : (
                "회원가입"
              )}
            </button>
          </form>
          {errorMessage && <p className="mt-3 text-center text-sm text-amber-600">{errorMessage}</p>}

          {/* Toggle mode */}
          <p className="mt-6 text-center text-lg text-muted-foreground">
            {mode === "login" ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-bold text-blue-500 hover:underline"
            >
              {mode === "login" ? "회원가입" : "로그인"}
            </button>
          </p>
        </div>

        {/* Features hint */}
        <div className="flex items-center gap-4 text-base text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>AI 피부 진단</span>
          </div>
          <div className="h-3 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span>무료 체험</span>
          </div>
          <div className="h-3 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span>즉시 결과</span>
          </div>
        </div>
      </div>
    </div>
  )
}
