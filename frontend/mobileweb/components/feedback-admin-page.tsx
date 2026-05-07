"use client"

import { useState, useEffect } from "react"
import { feedbackService } from "@/lib/api-services"
import type { FeedbackItem, PaginatedResponse } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Reply, Trash2, User, Star, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function FeedbackAdminPage() {
  const [feedbacks, setFeedbacks] = useState<PaginatedResponse<FeedbackItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [statusFilter, setStatusFilter] = useState<"pending" | "reviewed" | "resolved" | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const params = statusFilter === "all" ? {} : { status: statusFilter }
      const data = await feedbackService.getFeedbacks(currentPage, 20, params.status)
      setFeedbacks(data)
    } catch (error) {
      toast.error("피드백 목록을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [currentPage, statusFilter])

  const handleReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return

    try {
      await feedbackService.replyToFeedback(selectedFeedback.id, replyText)
      toast.success("답변이 등록되었습니다.")
      setReplyText("")
      setReplyDialogOpen(false)
      fetchFeedbacks()
    } catch (error) {
      toast.error("답변 등록에 실패했습니다.")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await feedbackService.deleteFeedback(id)
      toast.success("피드백이 삭제되었습니다.")
      fetchFeedbacks()
    } catch (error) {
      toast.error("피드백 삭제에 실패했습니다.")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800"
    }
    const labels = {
      pending: "대기중",
      reviewed: "검토중",
      resolved: "완료"
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="w-8 h-8" />
          피드백 관리
        </h1>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="reviewed">검토중</SelectItem>
              <SelectItem value="resolved">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {feedbacks?.items && feedbacks.items.length > 0 ? (
        <div className="space-y-4">
          {feedbacks.items.map((feedback) => (
            <Card key={feedback.id} className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{feedback.userName}</span>
                        <span className="text-sm text-gray-500">({feedback.userEmail})</span>
                      </div>
                      {getStatusBadge(feedback.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {getRatingStars(feedback.rating)}
                        <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(feedback.createdAt).toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFeedback(feedback)
                            setReplyText(feedback.adminReply || "")
                          }}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          답변
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>피드백 답변</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{feedback.userName}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {getRatingStars(feedback.rating)}
                            </div>
                            <p className="text-sm">{feedback.message}</p>
                          </div>
                          <Textarea
                            placeholder="답변 내용을 입력하세요..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                              취소
                            </Button>
                            <Button onClick={handleReply}>
                              답변 등록
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>피드백 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 피드백을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(feedback.id)}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">피드백 내용</h4>
                    <p className="text-gray-700">{feedback.message}</p>
                  </div>
                  {feedback.adminReply && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600">관리자 답변</span>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.adminReplyAt!).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="text-gray-700">{feedback.adminReply}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">피드백이 없습니다.</p>
          </CardContent>
        </Card>
      )}

      {feedbacks && feedbacks.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            이전
          </Button>
          <span className="text-sm text-gray-600">
            페이지 {currentPage} / {feedbacks.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === feedbacks.pagination.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
