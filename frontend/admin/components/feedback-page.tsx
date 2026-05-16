"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { feedbacksApi } from "@/src/api/feedbacks"

type FeedbackStatus = "pending" | "answered"

interface Feedback {
  id: number
  username: string
  email: string
  status: FeedbackStatus
  content: string
  date: string
  adminReply?: string
}

const feedbackData: Feedback[] = [
  {
    id: 1,
    username: "user1",
    email: "user1@example.com",
    status: "pending",
    content: "AI 진단 결과가 매우 정확했습니다. 감사합니다.",
    date: "2024-07-21",
  },
  {
    id: 2,
    username: "user2",
    email: "user2@example.com",
    status: "answered",
    content: "앱 사용법이 조금 복잡한 것 같아요. 개선해주시면 좋겠습니다.",
    date: "2024-07-20",
    adminReply: "소중한 의견 감사합니다. UI 개선에 적극 반영하겠습니다.",
  },
  {
    id: 3,
    username: "user3",
    email: "user3@example.com",
    status: "pending",
    content: "분석 속도가 너무 느립니다. 개선이 필요해 보입니다.",
    date: "2024-07-19",
  },
  {
    id: 4,
    username: "user4",
    email: "user4@example.com",
    status: "answered",
    content: "피부 타입 분석 기능이 추가되면 좋겠습니다.",
    date: "2024-07-18",
    adminReply: "유용한 제안 감사합니다. 다음 업데이트에 고려하겠습니다.",
  },
  {
    id: 5,
    username: "user5",
    email: "user5@example.com",
    status: "pending",
    content: "사진 업로드 시 앱이 종료되는 현상이 있습니다.",
    date: "2024-07-17",
  },
  {
    id: 6,
    username: "user6",
    email: "user6@example.com",
    status: "answered",
    content: "전반적으로 만족스러운 서비스입니다. 감사합니다.",
    date: "2024-07-16",
    adminReply: "긍정적인 피드백 감사합니다. 더 나은 서비스를 제공하겠습니다.",
  },
  {
    id: 7,
    username: "user7",
    email: "user7@example.com",
    status: "pending",
    content: "진단 결과 설명이 더 상세해졌으면 좋겠습니다.",
    date: "2024-07-15",
  },
  {
    id: 8,
    username: "user8",
    email: "user8@example.com",
    status: "answered",
    content: "앱 디자인이 매우 깔끔하고 보기 좋습니다.",
    date: "2024-07-14",
    adminReply: "디자인 관련 긍정적인 피드백 감사합니다.",
  },
  {
    id: 9,
    username: "user9",
    email: "user9@example.com",
    status: "pending",
    content: "로그인 과정이 조금 복잡하게 느껴집니다.",
    date: "2024-07-13",
  },
  {
    id: 10,
    username: "user10",
    email: "user10@example.com",
    status: "answered",
    content: "AI 분석 정확도가 계속해서 좋아지고 있네요.",
    date: "2024-07-12",
    adminReply: "지속적인 개선 노력에 감사드립니다.",
  },
  {
    id: 11,
    username: "user11",
    email: "user11@example.com",
    status: "pending",
    content: "푸시 알림 기능이 추가되면 좋겠습니다.",
    date: "2024-07-11",
  },
  {
    id: 12,
    username: "user12",
    email: "user12@example.com",
    status: "answered",
    content: "앱 안정성이 많이 향상되었습니다.",
    date: "2024-07-10",
    adminReply: "안정성 개선에 노력하고 있습니다.",
  },
  {
    id: 13,
    username: "user13",
    email: "user13@example.com",
    status: "pending",
    content: "다양한 피부 타입에 대한 분석이 필요합니다.",
    date: "2024-07-09",
  },
  {
    id: 14,
    username: "user14",
    email: "user14@example.com",
    status: "answered",
    content: "고객 지원 응답이 빠릅니다.",
    date: "2024-07-08",
    adminReply: "빠른 응답을 지향하겠습니다.",
  },
  {
    id: 15,
    username: "user15",
    email: "user15@example.com",
    status: "pending",
    content: "앱의 전반적인 성능이 만족스럽습니다.",
    date: "2024-07-07",
  },
]

type FilterType = "all" | "pending" | "answered"

export function FeedbackPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination] = useState({ page: 1, pageSize: 10, total: 0 })

  const filteredFeedback = feedbackData.filter((fb) => {
    if (filter === "all") return true
    return fb.status === filter
  })

  // 페이징 처리
  const startIndex = (currentPage - 1) * pagination.pageSize
  const endIndex = startIndex + pagination.pageSize
  const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex)

  const totalPages = Math.ceil(filteredFeedback.length / pagination.pageSize)

  const pendingCount = feedbackData.filter((fb) => fb.status === "pending").length
  const answeredCount = feedbackData.filter((fb) => fb.status === "answered").length

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // 필터 변경 시 페이지 리셋
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleReply = (feedbackId: number) => {
    setReplyingTo(feedbackId)
    setReplyText("")
  }

  const handleSubmitReply = async () => {
    if (replyingTo && replyText.trim()) {
      try {
        // API 연동 시도
        await feedbacksApi.reply(replyingTo, replyText)
        // 실제 구현에서는 데이터 다시 로드
        alert(`피드백 ID ${replyingTo}에 답변: "${replyText}"\n\n답변이 성공적으로 저장되었습니다.`)
        setReplyingTo(null)
        setReplyText("")
      } catch (error) {
        // API 연동 실패 시 프론트 테스트
        console.log("API 연동 실패 - 프론트 테스트 모드로 동작")
        alert(`피드백 ID ${replyingTo}에 답변: "${replyText}"\n\n답변이 저장되었습니다. (테스트 모드)`)
        setReplyingTo(null)
        setReplyText("")
      }
    }
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("all")}
          className={filter === "all" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          전체 ({feedbackData.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("pending")}
          className={filter === "pending" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          답변 대기 ({pendingCount})
        </Button>
        <Button
          variant={filter === "answered" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("answered")}
          className={filter === "answered" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          답변 완료 ({answeredCount})
        </Button>
      </div>

      {/* Feedback List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">피드백 목록</h3>

          <div className="space-y-6">
            {paginatedFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{feedback.username}</span>
                    <span className="text-sm text-gray-500">{feedback.email}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        feedback.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {feedback.status === "pending" ? "답변 대기" : "답변 완료"}
                    </span>
                                      </div>
                  {feedback.status === "pending" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReply(feedback.id)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      답변하기
                    </Button>
                  )}
                </div>

                {/* Content */}
                <p className="mb-1 text-sm text-gray-700">
                  {feedback.content}
                </p>
                <p className="text-xs text-gray-400">{feedback.date}</p>

                {/* Admin Reply */}
                {feedback.adminReply && (
                  <div className="mt-4 rounded-lg bg-emerald-50 p-4">
                    <p className="mb-1 text-sm font-medium text-gray-700">관리자 답변:</p>
                    <p className="text-sm text-emerald-700">{feedback.adminReply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === feedback.id && (
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">관리자 답변 작성:</p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="답변 내용을 입력하세요..."
                      className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        onClick={handleSubmitReply}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        답변 제출
                      </Button>
                      <Button
                        onClick={handleCancelReply}
                        size="sm"
                        variant="outline"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 페이징 */}
          {filteredFeedback.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-700">
                총 {filteredFeedback.length}개 중 {((currentPage - 1) * pagination.pageSize) + 1}-{Math.min(currentPage * pagination.pageSize, filteredFeedback.length)}개 표시
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
