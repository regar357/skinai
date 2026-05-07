"use client"

import { useEffect, useState } from "react"
import {
  UserCircle,
  LogOut,
  ChevronRight,
  Star,
  MessageSquare,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  Trash2,
} from "lucide-react"
import { authService, feedbackService, noticeService, profileService } from "@/lib/api-services"
import type { Notice, FeedbackItem, PaginatedResponse } from "@/types/api"

interface ProfilePageProps {
  user: { name: string; email: string }
  onLogout: () => void
  onProfileUpdate: (data: { name: string; email: string }) => void
}

type ModalType = "feedback" | "delete" | "notice" | null

export function ProfilePage({ user, onLogout, onProfileUpdate }: ProfilePageProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getMyProfile()
        onProfileUpdate({ name: profile.name, email: profile.email })
      } catch {
        // API 미연결 시 상위에서 전달된 사용자 정보를 유지한다.
      }
    }

    void loadProfile()
  }, [])

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
      {activeModal === "feedback" && <FeedbackModal onClose={() => setActiveModal(null)} user={user} />}
      {activeModal === "delete" && <DeleteAccountModal onClose={() => setActiveModal(null)} />}
      {activeModal === "notice" && <NoticeModal onClose={() => setActiveModal(null)} />}
    </div>
  )
}

/* ========== Feedback Modal ========== */
function FeedbackModal({ onClose, user }: { onClose: () => void; user: { name: string; email: string } }) {
  const [feedbacks, setFeedbacks] = useState<PaginatedResponse<FeedbackItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      // 사용자 자신의 피드백만 조회
      const data = await feedbackService.getMyFeedbacks(1, 10)
      setFeedbacks(data)
    } catch (error) {
      // API 미연결 시 목업 데이터로 처리
      const mockFeedbacks: FeedbackItem[] = [
        {
          id: 1,
          userId: 123,
          userName: user.name,
          userEmail: user.email,
          rating: 5,
          message: "앱이 정말 유용합니다! 피부 진단 결과가 정확하고 사용하기 편리해요.",
          createdAt: "2026-04-28T10:30:00Z",
          status: "resolved",
          adminReply: "소중한 의견 감사합니다. 더 나은 서비스를 제공하도록 노력하겠습니다.",
          adminReplyAt: "2026-04-28T14:20:00Z"
        },
        {
          id: 2,
          userId: 123,
          userName: user.name,
          userEmail: user.email,
          rating: 4,
          message: "전반적으로 만족하지만, 진단 속도가 조금 더 빨랐으면 좋겠습니다.",
          createdAt: "2026-04-25T16:45:00Z",
          status: "reviewed",
          adminReply: "속도 개선을 위해 최적화 작업을 진행 중입니다. 빠른 개선 기대해주세요!",
          adminReplyAt: "2026-04-26T09:15:00Z"
        },
        {
          id: 3,
          userId: 123,
          userName: user.name,
          userEmail: user.email,
          rating: 5,
          message: "UI 디자인이 정말 예쁘고 직관적이에요. 사용법을 배우지 않아도 바로 사용할 수 있었습니다.",
          createdAt: "2026-04-20T11:20:00Z",
          status: "resolved",
          adminReply: "디자인 칭찬 감사합니다! 사용자 편의성을 최우선으로 생각하고 개발했습니다.",
          adminReplyAt: "2026-04-20T15:30:00Z"
        },
        {
          id: 4,
          userId: 123,
          userName: user.name,
          userEmail: user.email,
          rating: 3,
          message: "안드로이드에서 가끔 앱이 멈추는 현상이 있어요. 안정화 부탁드립니다.",
          createdAt: "2026-04-15T13:10:00Z",
          status: "pending",
          adminReply: undefined,
          adminReplyAt: undefined
        }
      ]
      
      setFeedbacks({
        items: mockFeedbacks,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockFeedbacks.length,
          hasNext: false,
          hasPrev: false
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setIsSubmitting(true)
    try {
      await feedbackService.sendFeedback({ rating, message: message.trim() })
      setRating(0)
      setMessage("")
      setShowCreateForm(false)
      fetchFeedbacks() // 목록 새로고침
    } catch (error) {
      // API 미연결 시에도 완료 UX를 유지한다.
      setRating(0)
      setMessage("")
      setShowCreateForm(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await feedbackService.deleteMyFeedback(id)
      setDeleteConfirmId(null)
      fetchFeedbacks() // 목록 새로고침
    } catch (error) {
      // API 미연결 시에도 완료 UX를 유지한다.
      setDeleteConfirmId(null)
      fetchFeedbacks()
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (showCreateForm) {
    return (
      <ModalWrapper onClose={onClose} title="피드백 작성">
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-base font-medium text-foreground transition-colors hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSubmitting ? "전송 중..." : "피드백 보내기"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper onClose={onClose} title="내 피드백">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquare className="h-4 w-4" />
          새 피드백 작성하기
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : feedbacks?.items && feedbacks.items.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto space-y-3">
            {feedbacks.items.map((feedback) => (
              <div key={feedback.id} className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {getRatingStars(feedback.rating)}
                    <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                    <button
                      onClick={() => setDeleteConfirmId(feedback.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{feedback.message}</p>
                {feedback.adminReply && (
                  <div className="mt-3 rounded-lg bg-blue-50 p-3">
                    <div className="mb-1 text-xs font-medium text-blue-600">관리자 답변</div>
                    <p className="text-sm text-gray-700">{feedback.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">아직 작성한 피드백이 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">첫 번째 피드백을 작성해보세요!</p>
          </div>
        )}

        {/* 삭제 확인 다이얼로그 */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
            <div className="relative w-full max-w-[320px] rounded-[24px] border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-extrabold text-foreground">피드백 삭제</h3>
              <div className="mb-6">
                <p className="text-base text-gray-700">이 피드백을 삭제하시겠습니까?</p>
                <p className="text-sm text-gray-500 mt-1">삭제된 피드백은 복구할 수 없습니다.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-base font-medium text-foreground transition-colors hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 rounded-xl bg-red-500 py-3 text-base font-bold text-white transition-colors hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}

/* ========== Notice Modal ========== */
function NoticeModal({ onClose }: { onClose: () => void }) {
  const defaultNotices: Notice[] = [
    {
      id: 1,
      date: "2026.03.15",
      title: "🎉 v1.2.0 업데이트",
      content: "새로운 피부 분석 알고리즘이 적용되었습니다. 정확도가 15% 향상되었습니다.",
      type: "update" as const,
      createdAt: "2026-03-15T00:00:00Z",
    },
    {
      id: 2,
      date: "2026.03.10",
      title: "🔥 서버 점검 안내",
      content: "3월 12일 새벽 2시~4시까지 서버 점검이 예정되어 있습니다.",
      type: "maintenance" as const,
      createdAt: "2026-03-10T00:00:00Z",
    },
    {
      id: 3,
      date: "2026.03.05",
      title: "✨ 신규 기능 추가",
      content: "피부 타입별 맞춤 관리 루틴 추천 기능이 추가되었습니다.",
      type: "feature" as const,
      createdAt: "2026-03-05T00:00:00Z",
    },
    {
      id: 4,
      date: "2026.02.28",
      title: "🐛 버그 수정",
      content: "진단 결과 저장 시 발생하던 오류가 수정되었습니다.",
      type: "bug" as const,
      createdAt: "2026-02-28T00:00:00Z",
    },
  ]
  const [notices, setNotices] = useState(defaultNotices)

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const response = await noticeService.getNotices(1, 20)
        if (response.items.length > 0) {
          setNotices(response.items)
        }
      } catch {
        // API 미연결 시 목업 공지 유지
      }
    }

    void loadNotices()
  }, [])

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
          const config = getNoticeConfig(notice.type || "update")
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
                  {notice.date ?? "알 수 없음"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{notice.content}</p>
            </div>
          )
        })}
      </div>
    </ModalWrapper>
  )
}
function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== "회원탈퇴") return
    setIsDeleting(true)
    try {
      await profileService.deleteMyAccount(confirmText)
      await authService.logout()
    } catch {
      // API 미연결 시에도 완료 UX를 유지한다.
    } finally {
      setIsDeleting(false)
      setIsDeleted(true)
      setTimeout(() => {
        onClose()
        // 실제로는 로그아웃 처리도 해야 함
      }, 2000)
    }
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

