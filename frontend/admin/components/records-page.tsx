"use client"

import React, { useState } from "react"
import { Search, Download, Calendar } from "lucide-react"
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
import { analysisApi } from "@/src/api/analysis"
import { searchService, MockExamRecord } from "@/src/services/search-service"

export function RecordsPage() {
  const [search, setSearch] = useState("")
  const [records, setRecords] = useState<MockExamRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
  const [currentPage, setCurrentPage] = useState(1)

  // 검색 기능
  const handleSearch = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await searchService.searchRecords({
        query: search,
        page: page,
        pageSize: 10
      })
      setRecords(result.data)
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total
      })
      setCurrentPage(page)
    } catch (error) {
      console.error('검사기록 검색 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 검색어가 변경될 때마다 검색 실행
  React.useEffect(() => {
    setCurrentPage(1)
    handleSearch(1)
  }, [search])

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    handleSearch(newPage)
  }

  const handleImageClick = async (imageId: string) => {
    try {
      // API 연동 시도
      const response = await analysisApi.getImageInfo(imageId)
      alert(`이미지 ID: ${imageId}\n\n파일명: ${response.data.fileName}\n크기: ${response.data.fileSize} bytes\n업로드일: ${response.data.uploadedAt}`)
    } catch (error) {
      // API 연동 실패 시 프론트 테스트
      console.log("API 연동 실패 - 프론트 테스트 모드로 동작")
      alert(`이미지 ID: ${imageId}\n\n파일명: image_${imageId}.jpg\n크기: 2.5 MB\n업로드일: 2024-07-21\n\n(테스트 모드)`)
    }
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="사용자명 또는 질환명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">검사 기록 목록</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-16 px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">사용자명</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">사용자ID</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">검사일자</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">이미지</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">의심질환명</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">확률</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record: MockExamRecord) => (
              <TableRow key={record.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <TableCell className="px-5 py-4 text-sm font-medium text-gray-700">{record.id}</TableCell>
                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800">{record.username}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-blue-600 font-medium">{record.userId}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{record.examDate}</TableCell>
                <TableCell className="px-5 py-4 text-sm">
                  {record.imageUrl ? (
                    <img
                      src={record.imageUrl}
                      alt="진단 이미지"
                      className="h-12 w-12 rounded-md object-cover cursor-pointer"
                      onClick={() => handleImageClick(record.imageId)}
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">없음</span>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700">{record.result}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700">{record.confidence}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {records.length === 0 && (
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
      </div>
    </div>
  )
}
