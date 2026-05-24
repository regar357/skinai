"use client"

import React, { useState } from "react"
import { Search, Plus, Download, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { searchService, MockUser } from "@/src/services/search-service"
import { usersApi } from "@/src/api/users"

function StatusBadge({ status }: { status: "활성" | "정지" | "삭제" }) {
  if (status === "활성") {
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
        활성
      </span>
    )
  }
  if (status === "정지") {
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700">
        정지
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700">
      삭제
    </span>
  )
}

export function UsersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState<number | null>(null)
  const [users, setUsers] = useState<MockUser[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [currentPage, setCurrentPage] = useState(1)

  // 검색 기능
  const handleSearch = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await searchService.searchUsers({
        query: search,
        filters: { status: statusFilter },
        page: page,
        pageSize: 10
      })
      setUsers(result.data)
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total
      })
      setCurrentPage(page)
    } catch (error) {
      console.error('사용자 검색 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 검색어나 필터가 변경될 때마다 검색 실행
  React.useEffect(() => {
    setCurrentPage(1)
    handleSearch(1)
  }, [search, statusFilter])

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    handleSearch(newPage)
  }

  const handleSuspend = async (userId: number) => {
    try {
      await usersApi.suspend(userId)
      handleSearch(currentPage)
    } catch (error) {
      console.warn("API 연동 실패 - 테스트 모드")
      alert(`사용자 ID ${userId}를 정지합니다. (테스트 모드)`)
    }
  }

  const handleUnsuspend = async (userId: number) => {
    try {
      await usersApi.unsuspend(userId)
      handleSearch(currentPage)
    } catch (error) {
      console.warn("API 연동 실패 - 테스트 모드")
      alert(`사용자 ID ${userId}의 정지를 해제합니다. (테스트 모드)`)
    }
  }

  const handleDeleteClick = (userId: number) => {
    setDeleteConfirmUserId(userId)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmUserId) {
      try {
        await usersApi.delete(deleteConfirmUserId)
        setDeleteConfirmUserId(null)
        handleSearch(1)
      } catch (error) {
        console.warn("API 연동 실패 - 테스트 모드")
        alert(`사용자 ID ${deleteConfirmUserId}를 삭제합니다. (테스트 모드)`)
        setDeleteConfirmUserId(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmUserId(null)
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {/* 사용자 추가 및 내보내기 버튼 제거됨 */}
        {/* 사용자 추가 및 내보내기 버튼 제거됨 */}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="사용자 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9 text-sm bg-white">
            <SelectValue placeholder="전체 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="활성">활성</SelectItem>
            <SelectItem value="정지">정지</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-16 px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">사용자명</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">이메일</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">가입일</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">마지막 로그인</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">분석 횟수</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: MockUser) => (
              <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <TableCell className="px-5 py-4 text-sm font-medium text-blue-600">{user.id}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-800 font-medium">{user.username}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{user.email}</TableCell>
                <TableCell className="px-5 py-4">
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{user.joinDate}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{user.lastLogin}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700">{user.analysisCount}</TableCell>
                <TableCell className="px-5 py-4 text-sm">
                  {user.status === "활성" ? (
                    <span className="flex gap-3">
                      <button className="text-orange-500 hover:text-orange-600 font-medium" onClick={() => handleSuspend(user.id)}>정지</button>
                      <button className="text-red-500 hover:text-red-600 font-medium" onClick={() => handleDeleteClick(user.id)}>삭제</button>
                    </span>
                  ) : (
                    <span className="flex gap-3">
                      <button className="text-blue-500 hover:text-blue-600 font-medium" onClick={() => handleUnsuspend(user.id)}>해제</button>
                      <button className="text-red-500 hover:text-red-600 font-medium" onClick={() => handleDeleteClick(user.id)}>삭제</button>
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}

        {/* 페이징 */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-700">
              총 {pagination.total}개 중 {((currentPage - 1) * pagination.pageSize) + 1}-{Math.min(currentPage * pagination.pageSize, pagination.total)}개 표시
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1).map((page) => (
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
                disabled={currentPage === Math.ceil(pagination.total / pagination.pageSize)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* 페이징 */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-700">
              총 {pagination.total}개 중 {((currentPage - 1) * pagination.pageSize) + 1}-{Math.min(currentPage * pagination.pageSize, pagination.total)}개 표시
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1).map((page) => (
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
                disabled={currentPage === Math.ceil(pagination.total / pagination.pageSize)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {deleteConfirmUserId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">사용자 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleDeleteCancel}
                variant="outline"
                className="px-4 py-2"
              >
                취소
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirmUserId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">사용자 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleDeleteCancel}
                variant="outline"
                className="px-4 py-2"
              >
                취소
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
