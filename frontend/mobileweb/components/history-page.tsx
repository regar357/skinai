"use client"

import { useEffect, useState } from "react"
import {
  ShieldCheck,
  AlertTriangle,
  X,
  Trash2,
  Check,
  Download,
  Share2,
  ChevronRight,
} from "lucide-react"
import { ShareModal } from "@/components/share-modal"
import { generateDirectPDF, downloadPDF } from "@/utils/direct-pdf"
import { diagnosisService } from "@/lib/api-services"

const historyData = [
  {
    id: 1,
    date: "2026.03.01",
    result: "기저세포암",
    score: 78,
    thumbnail: "/안면부홍반.jpg",
  },
  {
    id: 2,
    date: "2026.02.14",
    result: "편평세포암",
    score: 65,
    thumbnail: "/안면부 종양.jpg",
  },
  {
    id: 3,
    date: "2026.01.28",
    result: "흑색종",
    score: 52,
    thumbnail: "/피부장벽개선.jpg",
  },
  {
    id: 4,
    date: "2026.01.05",
    result: "지루성 각화증",
    score: 88,
    thumbnail: "/지루성 피부염.jpg",
  },
  {
    id: 5,
    date: "2025.12.20",
    result: "양성 모반",
    score: 91,
    thumbnail: "/색소침착.jpg",
  },
  {
    id: 6,
    date: "2025.11.15",
    result: "염증성 여드름",
    score: 48,
    thumbnail: "/염증성 여드름.jpg",
  },
]

type HistoryItem = (typeof historyData)[number]

function getStatusConfig(score: number) {
  if (score >= 70) {
    return {
      icon: AlertTriangle,
      badgeBg: "bg-red-50 text-red-600 border-red-200/60",
      barColor: "bg-gradient-to-r from-red-400 to-red-600",
      circleColor: "#ef4444",
    }
  } else if (score >= 30) {
    return {
      icon: AlertTriangle,
      badgeBg: "bg-orange-50 text-orange-600 border-orange-200/60",
      barColor: "bg-gradient-to-r from-orange-400 to-orange-600",
      circleColor: "#f97316",
    }
  }
  return {
    icon: ShieldCheck,
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
    circleColor: "#22c55e",
  }
}

/* Detail Modal */
function DetailModal({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  const [resolvedItem, setResolvedItem] = useState(item)
  const config = getStatusConfig(resolvedItem.score)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const detail = await diagnosisService.getById(item.id)
        setResolvedItem((prev) => ({
          ...prev,
          result: detail.result?.suspectedDisease || prev.result,
          score: detail.result?.probability ?? prev.score,
        }))
      } catch {
        // 상세 API 실패 시 리스트 데이터로 표시한다.
      }
    }

    void loadDetail()
  }, [item])

  const saveToFile = () => {
    const reportData = {
      date: resolvedItem.date,
      result: resolvedItem.result,
      score: resolvedItem.score,
      summary: `의심 질환: ${resolvedItem.result} (${resolvedItem.score}% 확률)`,
      details: {
        probability: resolvedItem.score
      },
      generatedAt: new Date().toISOString()
    }
    
    // 직접 PDF 생성 및 다운로드
    const pdfData = generateDirectPDF(reportData)
    const filename = `skinai-report-${resolvedItem.date.replace(/\./g, '-')}.pdf`
    const success = downloadPDF(pdfData, filename)
    
    if (success) {
      showToast('PDF 파일 다운로드가 되었습니다.')
    } else {
      showToast('PDF 파일이 새 창에서 열렸습니다. 저장을 선택해주세요.')
    }
  }

  // 토스트 메시지 함수
  const showToast = (message: string) => {
    // 기존 토스트가 있으면 제거
    const existingToast = document.getElementById('toast-message')
    if (existingToast) {
      existingToast.remove()
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div')
    toast.id = 'toast-message'
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      text-align: center;
    `
    
    document.body.appendChild(toast)
    
    // 3초 후 제거
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 3000)
  }

  const shareToSNS = () => {
    setIsShareModalOpen(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[90vh] w-full max-w-[450px] overflow-y-auto rounded-[28px] border border-white/40 bg-white/90 p-7 shadow-2xl backdrop-blur-xl">
                {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Section */}
        <div className="mb">
          <div className="flex gap-4">
            {/* Photo - 1.5x larger */}
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl shadow-lg flex-shrink-0">
              <img src={resolvedItem.thumbnail} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
            </div>
            
            {/* Date and Disease Name */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground">{resolvedItem.date}</p>
              <p className="mt-1 text-lg font-bold text-foreground">{resolvedItem.result}</p>
              
              {/* Probability circle below disease name */}
              <div className="mt-4 flex items-center gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke={config.circleColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={2 * Math.PI * 38 * (1 - resolvedItem.score / 100)}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-extrabold text-foreground">{resolvedItem.score}%</span>
                    <span className="text-xs font-bold text-muted-foreground">확률</span>
                  </div>
                </div>
                
                {/* Action buttons - icons only on the right */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={shareToSNS}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50"
                    aria-label="공유"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={saveToFile}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50"
                    aria-label="저장"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        
        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareData={{
            title: 'SkinAI 피부 진단 결과',
            text: `의심 질환: ${resolvedItem.result} (${resolvedItem.score}% 확률)\n날짜: ${resolvedItem.date}`,
            url: window.location.href,
          }}
        />
      </div>
    </div>
  )
}

export function HistoryPage() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [history, setHistory] = useState(historyData)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await diagnosisService.getHistory(1, 50)
        const mapped = response.items.map((item) => ({
          id: item.id,
          date: item.date,
          result: item.result,
          score: item.score,
          thumbnail: item.thumbnail,
        }))
        setHistory(mapped)
      } catch {
        // API 미연결 상태에서는 기존 목업 데이터를 그대로 사용한다.
      }
    }

    void loadHistory()
  }, [])

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  const deleteSelected = async () => {
    try {
      if (selectedIds.length === 1) {
        await diagnosisService.deleteOne(selectedIds[0])
      } else if (selectedIds.length > 1) {
        await diagnosisService.deleteMany(selectedIds)
      }
    } catch {
      // 삭제 API 실패 시에도 UI 동작은 유지한다.
    }

    setHistory(prev => prev.filter(item => !selectedIds.includes(item.id)))
    setSelectedIds([])
    setIsSelectionMode(false)
    // 현재 페이지가 비어있으면 이전 페이지로 이동
    const totalPages = Math.ceil((history.length - selectedIds.length) / itemsPerPage)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }

  const cancelSelection = () => {
    setSelectedIds([])
    setIsSelectionMode(false)
  }

  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(history.length / itemsPerPage)

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-8">
      {/* Header */}
      <div className="relative">
        {!isSelectionMode && (
          <button
            type="button"
            onClick={() => setIsSelectionMode(true)}
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500"
            aria-label="삭제 모드"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">진단 기록</h2>
        </div>
        {isSelectionMode && (
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <button
              type="button"
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
              className="flex h-9 items-center justify-center rounded-xl bg-red-500 px-3 text-base font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {selectedIds.length > 0 && `${selectedIds.length}개 `}
              삭제
            </button>
            <button
              type="button"
              onClick={cancelSelection}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-100"
              aria-label="취소"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* History list */}
      <div className="flex flex-col gap-4">
        {paginatedHistory.map((item, i) => {
          const config = getStatusConfig(item.score)
          const isSelected = selectedIds.includes(item.id)
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => isSelectionMode ? toggleSelection(item.id) : setSelectedItem(item)}
              className="flex items-center gap-4 rounded-[22px] border border-white/60 bg-white/60 p-4 shadow-lg shadow-blue-100/15 backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-200/25 text-left ${
                isSelected ? 'ring-2 ring-red-400 ring-offset-2' : ''
              }"
            >
              {/* Checkbox in selection mode */}
              {isSelectionMode && (
                <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                  isSelected 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
              )}

              {/* Thumbnail */}
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-md">
                <img src={item.thumbnail} alt={`Diagnosis from ${item.date}`} className="h-full w-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-sm font-semibold tracking-wide text-muted-foreground">{item.date}</span>
                <p className="truncate text-lg font-bold text-foreground">{item.result}</p>
              </div>
              
              {/* Circular progress */}
              <div className="relative h-16 w-16 flex-shrink-0">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={config.circleColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - item.score / 100)}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-foreground">{item.score}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-100 disabled:opacity-50"
            aria-label="이전 페이지"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-base font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-100 disabled:opacity-50"
            aria-label="다음 페이지"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
