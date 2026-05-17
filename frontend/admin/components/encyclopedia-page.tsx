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
import { searchService, MockEncyclopediaEntry } from "@/src/services/search-service"

export function EncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newEntry, setNewEntry] = useState({ title: "", description: "" })
  const [editingEntry, setEditingEntry] = useState<{ id: number; title: string; description: string } | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<{ id: number; title: string; description: string } | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [entries, setEntries] = useState<MockEncyclopediaEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [currentPage, setCurrentPage] = useState(1)

  // 검색 기능
  const handleSearch = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await searchService.searchEncyclopedia({
        query: searchTerm,
        page: page,
        pageSize: 10
      })
      setEntries(result.data)
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total
      })
      setCurrentPage(page)
    } catch (error) {
      console.error('백과사전 검색 실패:', error)
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

  const handleEdit = (entryId: number) => {
    const entry = entries.find((e: MockEncyclopediaEntry) => e.id === entryId)
    if (entry) {
      setEditingEntry({ id: entry.id, title: entry.title, description: entry.description })
      setShowEditModal(true)
    }
  }

  const handleEditSubmit = async () => {
    if (editingEntry && editingEntry.title.trim() && editingEntry.description.trim()) {
      try {
        await contentApi.diseases.update(editingEntry.id, {
          title: editingEntry.title,
          description: editingEntry.description
        })
        setShowEditModal(false)
        setEditingEntry(null)
        handleSearch(currentPage)
      } catch (error) {
        console.warn("API 연동 실패 - 테스트 모드")
        alert(`백과사전 항목 "${editingEntry.title}"이 수정되었습니다. (테스트 모드)`)
        setShowEditModal(false)
        setEditingEntry(null)
      }
    }
  }

  const handleEditCancel = () => {
    setShowEditModal(false)
    setEditingEntry(null)
  }

  const handleDeleteClick = (entryId: number) => {
    setDeleteConfirmId(entryId)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        await contentApi.diseases.delete(deleteConfirmId)
        setDeleteConfirmId(null)
        handleSearch(1)
      } catch (error) {
        console.warn("API 연동 실패 - 테스트 모드")
        alert(`백과사전 항목 ID ${deleteConfirmId}가 삭제되었습니다. (테스트 모드)`)
        setDeleteConfirmId(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  const handleAddClick = () => {
    setShowAddModal(true)
    setNewEntry({ title: "", description: "" })
  }

  const handleAddSubmit = async () => {
    if (newEntry.title.trim() && newEntry.description.trim()) {
      try {
        await contentApi.diseases.create({
          title: newEntry.title,
          description: newEntry.description
        })
        setShowAddModal(false)
        setNewEntry({ title: "", description: "" })
        handleSearch(1)
      } catch (error) {
        console.warn("API 연동 실패 - 테스트 모드")
        alert(`백과사전 항목 "${newEntry.title}"이 추가되었습니다. (테스트 모드)`)
        setShowAddModal(false)
        setNewEntry({ title: "", description: "" })
      }
    }
  }

  const handleAddCancel = () => {
    setShowAddModal(false)
    setNewEntry({ title: "", description: "" })
  }

  const handleDetail = (entryId: number) => {
    const entry = entries.find((e: MockEncyclopediaEntry) => e.id === entryId)
    if (entry) {
      setSelectedEntry({ id: entry.id, title: entry.title, description: entry.description })
      setShowDetailModal(true)
    }
  }

  const handleDetailClose = () => {
    setShowDetailModal(false)
    setSelectedEntry(null)
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          새 백과사전 항목 추가
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

      {/* Encyclopedia Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-16 font-medium text-gray-700">ID</TableHead>
                <TableHead className="w-64 font-medium text-gray-700">제목</TableHead>
                <TableHead className="font-medium text-gray-700">설명</TableHead>
                <TableHead className="w-32 font-medium text-gray-700">수정일</TableHead>
                <TableHead className="w-32 font-medium text-gray-700" style={{ textAlign: 'left', paddingLeft: '50px' }}>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry: MockEncyclopediaEntry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50 border-b">
                  <TableCell className="py-4 text-gray-900">{entry.id}</TableCell>
                  <TableCell className="py-4 font-medium text-blue-600">
                    {entry.title}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="flex-1 overflow-hidden" 
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}
                        title={entry.description}
                      >
                        {entry.description}
                      </div>
                      <button 
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap flex-shrink-0 underline"
                        onClick={() => handleDetail(entry.id)}
                      >
                        상세보기
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">{entry.modifiedDate}</TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-sm text-blue-500 hover:text-blue-700 font-medium" onClick={() => handleEdit(entry.id)}>수정</button>
                      <button className="text-sm text-red-500 hover:text-red-700 font-medium" onClick={() => handleDeleteClick(entry.id)}>삭제</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {entries.length === 0 && (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">백과사전 항목 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 백과사전 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">새 백과사전 항목 추가</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  placeholder="설명을 입력하세요"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
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
                disabled={!newEntry.title.trim() || !newEntry.description.trim()}
              >
                추가
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 항목 수정 모달 */}
      {showEditModal && editingEntry && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">백과사전 항목 수정</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={editingEntry.title}
                  onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  placeholder="설명을 입력하세요"
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
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
                disabled={!editingEntry.title.trim() || !editingEntry.description.trim()}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 상세보기 모달 */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedEntry.title}</h3>
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
                  {selectedEntry.description}
                </p>
              </div>
              
                          </div>
          </div>
        </div>
      )}
    </div>
  )
}
