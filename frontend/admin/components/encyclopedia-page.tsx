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

// 목업 피부종양 백과 데이터
const mockEncyclopedia: MockEncyclopediaEntry[] = [
  {
    id: 1,
    title: "기저세포암",
    description: "기저세포암(Basal Cell Carcinoma)은 피부암 중 가장 흔한 형태로, 대부분 햇빛에 노출된 부위에 발생합니다. 주로 얼굴, 목, 손등 등에 나타나며, 진주처럼 반짝이는 융기된 병변과 함께 혈관이 확장된 모습을 보입니다.\n\n[증상]\n- 반짝이는 진주색 융기\n- 중앙이 움푹 들어간 모양\n- 가장자리가 둥글게 솟아오름\n- 출혈이나 궤양 형성\n\n[치료]\n- 수술적 절제\n- 전기소작술\n- 냉동요법\n- 국소 약물 치료",
    modifiedDate: "2024-07-20"
  },
  {
    id: 2,
    title: "편평세포암",
    description: "편평세포암(Squamous Cell Carcinoma)은 피부의 각질형성세포에서 발생하는 악성 종양입니다. 주로 햇빛에 장기간 노출된 부위인 얼굴, 귀, 손등, 팔 등에 발생하며, 자라나는 속도가 비교적 빠릅니다.\n\n[증상]\n- 경화된 붉은 반점\n- 비늘 모양의 표면\n- 통증이나 출혈\n- 빠르게 커지는 융기 병변\n\n[치료]\n- 외과적 절제\n- Mohs 수술\n- 방사선 치료\n- 화학요법(진행된 경우)",
    modifiedDate: "2024-07-18"
  },
  {
    id: 3,
    title: "흑색종",
    description: "흑색종(Melanoma)은 색소를 생성하는 멜라닌 세포에서 시작하는 가장 위험한 피부암입니다. 조기 발견 시 완치율이 높지만, 전이가 발생하면 생명을 위협할 수 있습니다.\n\n[증상 - ABCDE 법칙]\n- A(Asymmetry): 비대칭\n- B(Border): 울퉁불퉁한 가장자리\n- C(Color): 색이 고르지 않음\n- D(Diameter): 6mm 이상\n- E(Evolving): 시간이 지나며 변화\n\n[치료]\n- 수술적 절제(광범위 절제)\n- 림프절 절제\n- 면역요법\n- 표적 치료",
    modifiedDate: "2024-07-15"
  },
  {
    id: 4,
    title: "지루성 각화증",
    description: "지루성 각화증(Seborrheic Keratosis)은 노화로 인해 발생하는 양성 피부 종양입니다. 암으로 발전하지 않지만, 외관상 흑색종과 혼동될 수 있어 주의가 필요합니다.\n\n[증상]\n- 갈색에서 검은색까지 다양한 색상\n- 약간 둥근 모양\n- 기름진 표면\n- '붙여놓은 것' 같은 외관\n- 크기 1mm ~ 5cm\n\n[치료]\n- 냉동요법\n- 전기소작술\n- 레이저 치료\n- 필요시 절제",
    modifiedDate: "2024-07-12"
  },
  {
    id: 5,
    title: "양성 멜라닌 세포 모반",
    description: "양성 멜라닌 세포 모반(Benign Melanocytic Nevus)은 일반적으로 '점'이라고 불리는 양성 피부 병변입니다. 선천적으로 있거나 후천적으로 발생할 수 있으며, 대부분 무해합니다.\n\n[특징]\n- 균일한 색상(갈색, 검은색, 분홍색 등)\n- 둥글거나 타원형\n- 가장자리가 매끄러움\n- 크기는 작음(보통 6mm 이하)\n- 시간이 지나도 거의 변화 없음\n\n[주의사항]\n- 모반의 변화가 있을 시 의료진 상담 필요",
    modifiedDate: "2024-07-10"
  },
  {
    id: 6,
    title: "악성 흑색종 변종",
    description: "악성 흑색종에는 여러 변종이 있으며, 각각 다른 임상적 특징을 보입니다.\n\n[주요 변종]\n- 표재 확장성 흑색종: 가장 흔한 형태, 수평 성장 단계\n- 결절성 흑색종: 수직 성장, 빠른 전이\n- 렌티고 악성 흑색종: 노인, 햇빛 손상 부위\n- 띰색소성 흑색종: 색소가 없는 형태\n\n[진단]\n- 피부 조직 검사가 필수적\n- 병기 결정을 위한 영상 검사\n- SLNB(전哨 림프절 생검)",
    modifiedDate: "2024-07-08"
  },
  {
    id: 7,
    title: "피부섬유종",
    description: "피부섬유종(Dermatofibroma)은 양성 섬유종양으로, 주로 다리에 발생하는 작은 단단한 융기입니다. 대부분 무증상이며, 외상 후 발생하는 경우가 많습니다.\n\n[증상]\n- 작은 단단한 융기(5-10mm)\n- 갈색, 적갈색, 보라색\n- 누르면 움푹 들어감\n- 주로 다리에 발생\n- 통증이나 간지러움은 흔하지 않음\n\n[치료]\n- 대부분 치료 불필요\n- 제거 시 외과적 절제\n- 냉동요법",
    modifiedDate: "2024-07-05"
  },
  {
    id: 8,
    title: "日光각화증",
    description: "日光각화증(Actinic Keratosis)은 장기간 자외선 노출로 인한 피부의 전암 병변입니다. 편평세포암으로 발전할 가능성이 있어 적극적인 치료가 필요합니다.\n\n[증상]\n- 거친 비늘 모양의 반점\n- 붉거나 갈색\n- 크기 2-6mm\n- 주로 햇빛 노출 부위\n- 만지면 거친 느낌\n\n[치료]\n- 냉동요법\n- 국소 약물 치료(5-FU, 이미쿼드 등)\n- 화학박피\n- 레이저 치료",
    modifiedDate: "2024-07-01"
  },
  {
    id: 9,
    title: "카포시 육종",
    description: "카포시 육종(Kaposi Sarcoma)은 인간 헤르페스바이러스 8(HHV-8) 감염과 관련된 혈관 종양입니다. 면역저하 환자에서 발생률이 높으며, AIDS 관련 형태가 가장 흔합니다.\n\n[증상]\n- 보라색, 적갈색, 갈색 반점\n- 피부와 점막에 발생\n- 점차 융기되며 팽대\n- 다발성 병변\n- 간지러움 가능\n\n[치료]\n- 항레트로바이러스 치료(AIDS형)\n- 화학요법\n- 방사선 치료\n- 국소 치료",
    modifiedDate: "2024-06-28"
  },
  {
    id: 10,
    title: "피부림프종",
    description: "피부림프종(Cutaneous Lymphoma)은 림프구가 피부에서 악성화된 것입니다. 원발성(피부가 원발 부위)과 이차성(전신 림프종의 피부 침윤)으로 구분됩니다.\n\n[증상]\n- 붉은 반점, 패치, 융기\n- 두드러지는 병변\n- 간지러움\n- 다양한 형태\n- 천천히 진행\n\n[치료]\n- 국외 방사선 치료\n- 국소 스테로이드\n- 화학요법\n- 광화학요법(PUVA)",
    modifiedDate: "2024-06-25"
  },
  {
    id: 11,
    title: "혈관종",
    description: "혈관종(Hemangioma)은 혈관 세포의 양성 증식으로 발생하는 종양입니다. 유아에서 흔하게 발생하며, 대부분 자연 소실되지만 일부는 치료가 필요합니다.\n\n[특징]\n- 선홍색에서 진홍색 반점\n- 출생 시 또는 생후 수주 내 발생\n- 급격한 성장 후 정체\n- 대부분 5-9세에 자연 소실\n- 머리, 목, 몸통에 흔함\n\n[치료]\n- 대부분 관찰만 필요\n- 베타 차단제(프로프라놀롤)\n- 레이저 치료\n- 수술",
    modifiedDate: "2024-06-20"
  },
  {
    id: 12,
    title: "지루성 피부염",
    description: "지루성 피부염(Seborrheic Dermatitis)은 피지 분비가 많은 부위에 발생하는 만성 염증성 피부 질환입니다. 비듬과 밀접한 관련이 있습니다.\n\n[증상]\n- 붉은 반점과 황색 비늘\n- 두피, 얼굴 T존, 가슴 등\n- 가려움증\n- 기름진 비늘\n- 재발 경향\n\n[치료]\n- 항진균 샴푸(두피)\n- 국소 스테로이드\n- 칼시뉴린 억제제\n- 항진균제",
    modifiedDate: "2024-06-15"
  }
];

export function EncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newEntry, setNewEntry] = useState({ title: "", description: "" })
  const [editingEntry, setEditingEntry] = useState<{ id: number; title: string; description: string } | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<{ id: number; title: string; description: string } | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [entries, setEntries] = useState<MockEncyclopediaEntry[]>(mockEncyclopedia)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: mockEncyclopedia.length })
  const [currentPage, setCurrentPage] = useState(1)

  // 검색 기능
  const handleSearch = async (page: number = 1) => {
    setLoading(true)
    try {
      // 목업 데이터 필터링 및 페이징
      const query = searchTerm.toLowerCase()
      const filtered = mockEncyclopedia.filter(e => 
        !query || 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query)
      )
      
      const startIndex = (page - 1) * 10
      const endIndex = startIndex + 10
      const paginatedData = filtered.slice(startIndex, endIndex)
      
      setEntries(paginatedData)
      setPagination({
        page: page,
        pageSize: 10,
        total: filtered.length
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
                  <TableCell className="py-4 text-gray-600 max-w-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="flex-1 overflow-hidden text-sm leading-relaxed" 
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                        title={entry.description}
                      >
                        {entry.description.replace(/\n/g, ' ')}
                      </div>
                      <button 
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap flex-shrink-0 underline ml-2"
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
