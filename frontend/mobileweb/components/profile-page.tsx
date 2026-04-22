"use client"

import { useState } from "react"
import {
  UserCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Star,
  MessageSquare,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  Info,
} from "lucide-react"

interface ProfilePageProps {
  user: { name: string; email: string }
  onLogout: () => void
  onProfileUpdate: (data: { name: string; email: string }) => void
}

type ModalType = "feedback" | "delete" | "notice" | null

export function ProfilePage({ user, onLogout, onProfileUpdate }: ProfilePageProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const menuItems = [
    {
      id: "notice" as const,
      label: "개발자 공지사항",
      desc: "업데이트 및 공지 확인",
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: "feedback" as const,
      label: "개발자 피드백",
      desc: "앱 개선 의견 보내기",
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      id: "logout" as const,
      label: "로그아웃",
      desc: "계정에서 로그아웃합니다",
      icon: LogOut,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      id: "delete" as const,
      label: "회원탈퇴",
      desc: "계정을 영구적으로 삭제합니다",
      icon: X,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ]

  const handleMenuClick = (id: string) => {
    if (id === "logout") {
      onLogout()
    } else if (id === "feedback" || id === "delete" || id === "notice") {
      setActiveModal(id)
    }
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-6">
      {/* Profile card */}
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-white/40 bg-white/60 px-6 py-6 shadow-2xl shadow-blue-100/20 backdrop-blur-xl">
        {/* Avatar */}
        <div className="relative">
          <div
            className="absolute inset-0 scale-125 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-400/20 blur-xl"
            aria-hidden="true"
          />
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 ring-4 ring-white/80">
            <UserCircle className="h-12 w-12 text-white/90" strokeWidth={1.2} />
          </div>
          <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
        </div>

        {/* Name and info */}
        <div className="text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">{user.name}</h2>
          <p className="mt-0.5 text-base font-medium text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Menu list */}
      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMenuClick(item.id)}
              className="group flex items-center gap-3 rounded-[18px] border border-white/40 bg-white/60 px-4 py-3 shadow-md shadow-blue-50/20 backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100/25 active:scale-[0.98]"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} transition-transform group-hover:scale-110`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} strokeWidth={1.8} />
              </span>
              <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
                <span className="text-lg font-bold tracking-tight text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
            </button>
          )
        })}
      </div>

      {/* App version */}
      <p className="text-center text-xs text-muted-foreground/60">SkinAI v1.0.0</p>

      {/* Modals */}
      {activeModal === "feedback" && <FeedbackModal onClose={() => setActiveModal(null)} />}
      {activeModal === "delete" && <DeleteAccountModal onClose={() => setActiveModal(null)} />}
      {activeModal === "notice" && <NoticeModal onClose={() => setActiveModal(null)} />}
    </div>
  )
}

/* ========== Feedback Modal ========== */
function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <ModalWrapper onClose={onClose} title="피드백 전송 완료">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground">감사합니다!</p>
            <p className="mt-1 text-sm text-muted-foreground">소중한 의견 반영하겠습니다.</p>
          </div>
        </div>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper onClose={onClose} title="개발자 피드백">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">앱 만족도</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">의견</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="개선 아이디어나 불편한 점을 자유롭게 작성해주세요..."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-base font-medium text-foreground placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3 text-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isSubmitting ? "전송 중..." : "피드백 보내기"}
        </button>
      </form>
    </ModalWrapper>
  )
}

/* ========== Notice Modal ========== */
function NoticeModal({ onClose }: { onClose: () => void }) {
  const notices = [
    {
      id: 1,
      date: "2026.03.15",
      title: "🎉 v1.2.0 업데이트",
      content: "새로운 피부 분석 알고리즘이 적용되었습니다. 정확도가 15% 향상되었습니다.",
      type: "update" as const,
    },
    {
      id: 2,
      date: "2026.03.10",
      title: "🔥 서버 점검 안내",
      content: "3월 12일 새벽 2시~4시까지 서버 점검이 예정되어 있습니다.",
      type: "maintenance" as const,
    },
    {
      id: 3,
      date: "2026.03.05",
      title: "✨ 신규 기능 추가",
      content: "피부 타입별 맞춤 관리 루틴 추천 기능이 추가되었습니다.",
      type: "feature" as const,
    },
    {
      id: 4,
      date: "2026.02.28",
      title: "🐛 버그 수정",
      content: "진단 결과 저장 시 발생하던 오류가 수정되었습니다.",
      type: "bug" as const,
    },
  ]

  const getNoticeConfig = (type: string) => {
    switch (type) {
      case "update":
        return { color: "text-blue-500", bg: "bg-blue-50", icon: "🎉" }
      case "maintenance":
        return { color: "text-amber-500", bg: "bg-amber-50", icon: "🔥" }
      case "feature":
        return { color: "text-emerald-500", bg: "bg-emerald-50", icon: "✨" }
      case "bug":
        return { color: "text-rose-500", bg: "bg-rose-50", icon: "🐛" }
      default:
        return { color: "text-slate-500", bg: "bg-slate-50", icon: "📢" }
    }
  }

  return (
    <ModalWrapper onClose={onClose} title="개발자 공지사항">
      <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
        {notices.map((notice) => {
          const config = getNoticeConfig(notice.type)
          return (
            <div
              key={notice.id}
              className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.icon}</span>
                  <h4 className="text-base font-medium text-foreground">{notice.title}</h4>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {notice.date}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{notice.content}</p>
            </div>
          )
        })}
        
        <div className="mt-2 rounded-xl bg-blue-50 p-3">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs font-medium text-blue-800">더 많은 소식</p>
              <p className="mt-1 text-sm text-blue-600">
                공지사항은 앱 업데이트 시 자동으로 표시됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}

/* ========== Delete Account Modal ========== */
function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDelete = () => {
    if (confirmText !== "회원탈퇴") return
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleted(true)
      setTimeout(() => {
        onClose()
        // 실제로는 로그아웃 처리도 해야 함
      }, 2000)
    }, 2000)
  }

  if (isDeleted) {
    return (
      <ModalWrapper onClose={onClose} title="회원탈퇴 완료">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30">
            <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground">회원탈퇴가 완료되었습니다</p>
            <p className="mt-1 text-sm text-muted-foreground">그동안 이용해주셔서 감사합니다.</p>
          </div>
        </div>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper onClose={onClose} title="회원탈퇴">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-base font-medium text-red-800">⚠️ 정말 탈퇴하시겠습니까?</p>
          <p className="mt-2 text-sm text-red-600">
            회원탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            확인을 위해 "회원탈퇴"를 입력해주세요
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="회원탈퇴"
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-base font-medium text-foreground placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
          />
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={confirmText !== "회원탈퇴" || isDeleting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 text-xl font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          {isDeleting ? "처리 중..." : "회원탈퇴하기"}
        </button>
      </div>
    </ModalWrapper>
  )
}

/* ========== Modal Wrapper ========== */
function ModalWrapper({
  onClose,
  title,
  children,
}: {
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[380px] rounded-[24px] border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="mb-5 text-lg font-extrabold text-foreground">{title}</h3>
        {children}
      </div>
    </div>
  )
}

/* ========== Toggle Switch ========== */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        checked ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  )
}
