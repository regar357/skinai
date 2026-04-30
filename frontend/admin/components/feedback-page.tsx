"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type FeedbackStatus = "pending" | "answered"

interface Feedback {
  id: number
  username: string
  email: string
  status: FeedbackStatus
  category: string
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
    category: "진단 결과",
    content: "AI 진단 결과가 매우 정확했습니다. 감사합니다.",
    date: "2024-07-21",
  },
  {
    id: 2,
    username: "user2",
    email: "user2@example.com",
    status: "answered",
    category: "개선 제안",
    content: "앱 사용법이 조금 복잡한 것 같아요. 개선해주시면 좋겠습니다.",
    date: "2024-07-20",
    adminReply: "소중한 의견 감사합니다. UI 개선에 적극 반영하겠습니다.",
  },
  {
    id: 3,
    username: "user3",
    email: "user3@example.com",
    status: "pending",
    category: "성능",
    content: "분석 속도가 너무 느립니다. 개선이 필요해 보입니다.",
    date: "2024-07-19",
  },
  {
    id: 4,
    username: "김민수",
    email: "minsu.kim@example.com",
    status: "answered",
    category: "기능 요청",
    content: "진단 기록을 PDF로 내보내기 할 수 있으면 좋겠습니다.",
    date: "2024-07-18",
    adminReply: "좋은 제안 감사합니다. 다음 업데이트에 PDF 내보내기 기능을 추가할 예정입니다.",
  },
  {
    id: 5,
    username: "이서연",
    email: "seoyeon.lee@example.com",
    status: "pending",
    category: "버그 신고",
    content: "간헐적으로 이미지 업로드가 실패하는 현상이 있습니다.",
    date: "2024-07-17",
  },
  {
    id: 6,
    username: "박지훈",
    email: "jihoon.park@example.com",
    status: "answered",
    category: "진단 결과",
    content: "진단 결과 설명이 상세해서 이해하기 쉬웠습니다.",
    date: "2024-07-16",
    adminReply: "감사합니다. 앞으로도 사용자 분들이 쉽게 이해할 수 있도록 노력하겠습니다.",
  },
]

type FilterType = "all" | "pending" | "answered"

export function FeedbackPage() {
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredFeedback = feedbackData.filter((fb) => {
    if (filter === "all") return true
    return fb.status === filter
  })

  const pendingCount = feedbackData.filter((fb) => fb.status === "pending").length
  const answeredCount = feedbackData.filter((fb) => fb.status === "answered").length

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          전체 ({feedbackData.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          답변 대기 ({pendingCount})
        </Button>
        <Button
          variant={filter === "answered" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("answered")}
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
            {filteredFeedback.map((feedback) => (
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
                    <span className="text-sm text-gray-500">{feedback.category}</span>
                  </div>
                  <Button
                    variant={feedback.status === "pending" ? "default" : "outline"}
                    size="sm"
                    className={feedback.status === "pending" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    {feedback.status === "pending" ? "답변하기" : "수정"}
                  </Button>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
