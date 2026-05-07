"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { contentApi } from "@/src/api/content"
import { searchService, MockNotice } from "@/src/services/search-service"

export function NoticePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newNotice, setNewNotice] = useState({ title: "", content: "" })
  const [editingNotice, setEditingNotice] = useState<{ notice_id: number; title: string; content: string } | null>(null)
  const [selectedNotice, setSelectedNotice] = useState<{ notice_id: number; title: string; content: string } | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [notices, setNotices] = useState<MockNotice[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [currentPage, setCurrentPage] = useState(1)

  // 검색 기능
  const handleSearch = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await searchService.searchNotices({
        query: searchTerm,
        page: page,
        pageSize: 10
      })
      setNotices(result.data)
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total
      })
      setCurrentPage(page)
    } catch (error) {
      console.error('공지사항 검색 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 검색어가 변경될 때마다 검색 실행
  React.useEffect(() => {
    setCurrentPage(1)
    handleSearch(1)
  }, [searchTerm])

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    handleSearch(newPage)
  }

  const handleEdit = (noticeId: number) => {
    const notice = notices.find((n: MockNotice) => n.notice_id === noticeId)
    if (notice) {
      setEditingNotice({ notice_id: notice.notice_id, title: notice.title, content: notice.content })
      setShowEditModal(true)
    }
  }

  const handleDetail = (noticeId: number) => {
    const notice = notices.find((n: MockNotice) => n.notice_id === noticeId)
    if (notice) {
      setSelectedNotice({ notice_id: notice.notice_id, title: notice.title, content: notice.content })
      setShowDetailModal(true)
    }
  }

  const handleDetailClose = () => {
    setShowDetailModal(false)
    setSelectedNotice(null)
  }

  const handleEditSubmit = async () => {
    if (editingNotice && editingNotice.title.trim() && editingNotice.content.trim()) {
      try {
        // API 연동 시도
        await contentApi.notices.update(editingNotice.notice_id, {
          title: editingNotice.title,
          content: editingNotice.content
        })
        alert(`공지사항 "${editingNotice.title}"이 수정되었습니다.`)
        setShowEditModal(false)
        setEditingNotice(null)
        // 실제 구현에서는 데이터 다시 로드
      } catch (error) {
        // API 연동 실패 시 프론트 테스트
        console.log("API 연동 실패 - 프론트 테스트 모드로 동작")
        alert(`공지사항 "${editingNotice.title}"이 수정되었습니다. (테스트 모드)`)
        setShowEditModal(false)
        setEditingNotice(null)
      }
    }
  }

  const handleEditCancel = () => {
    setShowEditModal(false)
    setEditingNotice(null)
  }

  const handleDeleteClick = (noticeId: number) => {
    setDeleteConfirmId(noticeId)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        // API 연동 시도
        await contentApi.notices.delete(deleteConfirmId)
        alert(`공지사항 ID ${deleteConfirmId}가 삭제되었습니다.`)
        setDeleteConfirmId(null)
        // 실제 구현에서는 데이터 다시 로드
      } catch (error) {
        // API 연동 실패 시 프론트 테스트
        console.log("API 연동 실패 - 프론트 테스트 모드로 동작")
        alert(`공지사항 ID ${deleteConfirmId}가 삭제되었습니다. (테스트 모드)`)
        setDeleteConfirmId(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  const handleAddClick = () => {
    setShowAddModal(true)
    setNewNotice({ title: "", content: "" })
  }

  const handleAddSubmit = async () => {
    if (newNotice.title.trim() && newNotice.content.trim()) {
      try {
        // API 연동 시도
        await contentApi.notices.create({
          title: newNotice.title,
          content: newNotice.content,
          is_active: true
        })
        alert(`공지사항 "${newNotice.title}"이 추가되었습니다.`)
        setShowAddModal(false)
        setNewNotice({ title: "", content: "" })
        // 실제 구현에서는 데이터 다시 로드
      } catch (error) {
        // API 연동 실패 시 프론트 테스트
        console.log("API 연동 실패 - 프론트 테스트 모드로 동작")
        alert(`공지사항 "${newNotice.title}"이 추가되었습니다. (테스트 모드)`)
        setShowAddModal(false)
        setNewNotice({ title: "", content: "" })
      }
    }
  }

  const handleAddCancel = () => {
    setShowAddModal(false)
    setNewNotice({ title: "", content: "" })
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          새 공지사항 추가
        </Button>
        
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notice Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-16 font-medium text-gray-700">번호</TableHead>
                <TableHead className="font-medium text-gray-700">제목</TableHead>
                <TableHead className="w-32 font-medium text-gray-700">생성일</TableHead>
                <TableHead className="w-32 font-medium text-gray-700">수정일</TableHead>
                <TableHead className="w-32 font-medium text-gray-700" style={{ textAlign: 'left', paddingLeft: '50px' }}>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice: MockNotice) => (
                <TableRow key={notice.notice_id} className="hover:bg-gray-50 border-b">
                  <TableCell className="py-4 text-gray-900">{notice.notice_id}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="flex-1 overflow-hidden font-medium text-blue-600"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}
                        title={notice.title}
                      >
                        {notice.title}
                      </div>
                      <button 
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap flex-shrink-0 underline"
                        onClick={() => handleDetail(notice.notice_id)}
                      >
                        상세보기
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">{notice.created_at}</TableCell>
                  <TableCell className="py-4 text-gray-600">{notice.updated_at}</TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-sm text-blue-500 hover:text-blue-700 font-medium" onClick={() => handleEdit(notice.notice_id)}>수정</button>
                      <button className="text-sm text-red-500 hover:text-red-700 font-medium" onClick={() => handleDeleteClick(notice.notice_id)}>삭제</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {notices.length === 0 && (
            <div className="py-8 text-center text-gray-500">검색 결과가 없습니다.</div>
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
        </CardContent>
      </Card>

      {/* 삭제 확인 모달 */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">공지사항 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

      {/* 새 항목 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">새 공지사항 추가</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  placeholder="내용을 입력하세요"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <Button
                onClick={handleAddCancel}
                variant="outline"
                className="px-4 py-2"
              >
                취소
              </Button>
              <Button
                onClick={handleAddSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                disabled={!newNotice.title.trim() || !newNotice.content.trim()}
              >
                추가
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 항목 수정 모달 */}
      {showEditModal && editingNotice && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">공지사항 수정</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  placeholder="내용을 입력하세요"
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <Button
                onClick={handleEditCancel}
                variant="outline"
                className="px-4 py-2"
              >
                취소
              </Button>
              <Button
                onClick={handleEditSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                disabled={!editingNotice.title.trim() || !editingNotice.content.trim()}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 상세보기 모달 */}
      {showDetailModal && selectedNotice && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedNotice.title}</h3>
              <button
                onClick={handleDetailClose}
                className="text-gray-400 hover:text-gray-600 text-4xl leading-none p-2 -m-2"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
