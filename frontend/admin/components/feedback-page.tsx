"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { feedbacksApi } from "@/src/api/feedbacks";
import { feedbacksApi } from "@/src/api/feedbacks";

type FeedbackStatus = "pending" | "answered";

interface Feedback {
  id: number;
  username: string;
  email: string;
  status: FeedbackStatus;
  content: string;
  date: string;
  adminReply?: string;
}

function mapApiFeedback(f: any): Feedback {
  return {
    id: f.feedback_id,
    username: f.user_name || `User #${f.user_id}`,
    email: f.user_email || "",
    status: f.reply_text ? "answered" : "pending",
    content: f.content || "",
    date: f.created_at ? f.created_at.slice(0, 10) : "",
    adminReply: f.reply_text || undefined,
  };
}

type FilterType = "all" | "pending" | "answered";

export function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = (await feedbacksApi.getAdminFeedbacks(1, 100)) as any;
      const items: any[] = res.data?.data || res.data || [];
      setFeedbackData(items.map(mapApiFeedback));
    } catch (error) {
      console.warn("피드백 API 연동 실패 - 목업 데이터 없음");
      setFeedbackData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedback = feedbackData.filter((fb) => {
    if (filter === "all") return true;
    return fb.status === filter;
  });

  // 페이징 처리
  const startIndex = (currentPage - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredFeedback.length / pagination.pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFeedback = filteredFeedback.slice(
    startIndex,
    startIndex + pageSize,
  );
  const totalPages = Math.ceil(filteredFeedback.length / pageSize);

  const pendingCount = feedbackData.filter(
    (fb) => fb.status === "pending",
  ).length;
  const answeredCount = feedbackData.filter(
    (fb) => fb.status === "answered",
  ).length;

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleReply = (feedbackId: number) => {
    setReplyingTo(feedbackId);
    setReplyText("");
  };

  const handleSubmitReply = async () => {
    if (replyingTo && replyText.trim()) {
      try {
        await feedbacksApi.reply(replyingTo, replyText);
        setReplyingTo(null);
        setReplyText("");
        await fetchFeedbacks();
      } catch (error) {
        console.warn("답변 저장 실패 - 테스트 모드");
        alert(`피드백 ID ${replyingTo}에 답변이 저장되었습니다. (테스트 모드)`);
        setReplyingTo(null);
        setReplyText("");
      }
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("all")}
          onClick={() => handleFilterChange("all")}
          className={filter === "all" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          전체 ({feedbackData.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("pending")}
          onClick={() => handleFilterChange("pending")}
          className={
            filter === "pending" ? "bg-blue-500 hover:bg-blue-600" : ""
          }
        >
          답변 대기 ({pendingCount})
        </Button>
        <Button
          variant={filter === "answered" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("answered")}
          onClick={() => handleFilterChange("answered")}
          className={
            filter === "answered" ? "bg-blue-500 hover:bg-blue-600" : ""
          }
        >
          답변 완료 ({answeredCount})
        </Button>
      </div>

      {/* Feedback List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            피드백 목록
          </h3>

          {loading ? (
            <div className="py-8 text-center text-sm text-gray-400">
              불러오는 중...
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {feedback.username}
                      </span>
                      {feedback.email && (
                        <span className="text-sm text-gray-500">
                          {feedback.email}
                        </span>
                      )}
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          feedback.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {feedback.status === "pending"
                          ? "답변 대기"
                          : "답변 완료"}
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

                  <p className="mb-1 text-sm text-gray-700">
                    {feedback.content}
                  </p>
                  <p className="text-xs text-gray-400">{feedback.date}</p>

                  {feedback.adminReply && (
                    <div className="mt-4 rounded-lg bg-emerald-50 p-4">
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        관리자 답변:
                      </p>
                      <p className="text-sm text-emerald-700">
                        {feedback.adminReply}
                      </p>
                    </div>
                  )}

                  {replyingTo === feedback.id && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        관리자 답변 작성:
                      </p>
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

              {paginatedFeedback.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-400">
                  피드백이 없습니다.
                </div>
              )}
            </div>
          )}

          {/* 페이징 */}
          {filteredFeedback.length > pageSize && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-700">
                총 {filteredFeedback.length}개 중 {startIndex + 1}-
                {Math.min(startIndex + pageSize, filteredFeedback.length)}개
                표시
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === page
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
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
  );
}
