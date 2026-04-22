"use client"

import { useState } from "react"
import {
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  CalendarDays,
  X,
  Droplets,
  Sun,
  Layers,
  TrendingUp,
  Trash2,
  Check,
  Download,
  Share2,
  ChevronRight,
} from "lucide-react"

const historyData = [
  {
    id: 1,
    date: "2026.03.01",
    result: "주의",
    score: 65,
    status: "warn" as const,
    summary: "안면부 홍반 및 모세혈관 확장 감지",
    thumbnail: "/안면부홍반.jpg",
    details: { moisture: 58, uv: 72, barrier: 62, sebum: 68 },
  },
  {
    id: 2,
    date: "2026.02.14",
    result: "주의",
    score: 52,
    status: "warn" as const,
    summary: "피부 종양 의심 소견 (양성)",
    thumbnail: "/안면부 종양.jpg",
    details: { moisture: 45, uv: 85, barrier: 48, sebum: 72 },
  },
  {
    id: 3,
    date: "2026.01.28",
    result: "정상",
    score: 88,
    status: "good" as const,
    summary: "피부 장벽 기능 정상 범위",
    thumbnail: "/피부장벽개선.jpg",
    details: { moisture: 82, uv: 35, barrier: 90, sebum: 85 },
  },
  {
    id: 4,
    date: "2026.01.05",
    result: "주의",
    score: 58,
    status: "warn" as const,
    summary: "지루성 피부염 및 각질 과다",
    thumbnail: "/지루성 피부염.jpg",
    details: { moisture: 42, uv: 68, barrier: 55, sebum: 88 },
  },
  {
    id: 5,
    date: "2025.12.20",
    result: "정상",
    score: 91,
    status: "good" as const,
    summary: "색소 침착 개선 추세",
    thumbnail: "/색소침착.jpg",
    details: { moisture: 88, uv: 28, barrier: 92, sebum: 78 },
  },
  {
    id: 6,
    date: "2025.11.15",
    result: "주의",
    score: 48,
    status: "warn" as const,
    summary: "염증성 여드름 및 흉터 위험",
    thumbnail: "/염증성 여드름.jpg",
    details: { moisture: 38, uv: 78, barrier: 42, sebum: 92 },
  },
]

type HistoryItem = (typeof historyData)[number]

function getStatusConfig(status: "good" | "warn") {
  if (status === "good") {
    return {
      icon: ShieldCheck,
      badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
      iconColor: "text-emerald-500",
    }
  }
  return {
    icon: AlertTriangle,
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200/60",
    barColor: "bg-gradient-to-r from-amber-400 to-orange-500",
    iconColor: "text-amber-500",
  }
}

/* Detail Modal */
function DetailModal({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  const config = getStatusConfig(item.status)
  const StatusIcon = config.icon

  const saveToFile = () => {
    const reportData = {
      date: item.date,
      result: item.result,
      score: item.score,
      summary: item.summary,
      details: item.details,
      generatedAt: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `skinai-report-${item.date.replace(/\./g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const shareToSNS = () => {
    const shareText = `SkinAI 피부 진단 결과 📊\n날짜: ${item.date}\n결과: ${item.result}\n점수: ${item.score}점\n${item.summary}\n\n#SkinAI #피부진단 #뷰티`
    
    if (navigator.share) {
      navigator.share({
        title: 'SkinAI 피부 진단 결과',
        text: shareText,
        url: window.location.href
      }).catch(() => {
        // 사용자가 공유를 취소한 경우
      })
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard.writeText(shareText).then(() => {
        alert('공지 내용이 클립보드에 복사되었습니다.')
      })
    }
  }

  const detailItems = [
    { label: "피부 장벽 지수", score: item.details.barrier, icon: Layers, color: "from-emerald-400 to-teal-500", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "염증 수치", score: item.details.uv, icon: Sun, color: "from-amber-400 to-orange-500", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "수분 균형", score: item.details.moisture, icon: Droplets, color: "from-cyan-400 to-blue-500", iconBg: "bg-cyan-50", iconColor: "text-cyan-500" },
    { label: "피지 분비량", score: item.details.sebum, icon: TrendingUp, color: "from-violet-400 to-indigo-500", iconBg: "bg-violet-50", iconColor: "text-violet-500" },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[90vh] w-full max-w-[450px] overflow-y-auto rounded-[28px] border border-white/40 bg-white/90 p-7 shadow-2xl backdrop-blur-xl">
        {/* Action buttons */}
        <div className="absolute right-6 top-16 flex items-center gap-2">
          <button
            type="button"
            onClick={saveToFile}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400"
            aria-label="파일로 저장"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={shareToSNS}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400"
            aria-label="SNS 공유"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-lg">
            <img src={item.thumbnail} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground">{item.date}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{item.summary}</p>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-bold ${config.badgeBg}`}>
              <StatusIcon className="h-3 w-3" />
              {item.result}
            </span>
          </div>
        </div>

        {/* Score circle */}
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={item.status === "good" ? "#22c55e" : "#f59e0b"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - item.score / 100)}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-foreground">{item.score}</span>
              <span className="text-sm font-bold text-muted-foreground">/ 100</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {detailItems.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.label} className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${d.iconBg}`}>
                  <Icon className={`h-5 w-5 ${d.iconColor}`} />
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{d.label}</span>
                    <span className="text-sm font-extrabold tabular-nums text-foreground">{d.score}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full bg-gradient-to-r ${d.color}`} style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
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

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  const deleteSelected = () => {
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
          const config = getStatusConfig(item.status)
          const StatusIcon = config.icon
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide text-muted-foreground">{item.date}</span>
                  <span className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-bold ${config.badgeBg}`}>
                    <StatusIcon className="h-3 w-3" />
                    {item.result}
                  </span>
                </div>
                <p className="truncate text-lg font-bold text-foreground">{item.summary}</p>
                {/* Score bar */}
                <div className="flex items-center gap-2.5">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${config.barColor} transition-all duration-700`} style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">{item.score}%</span>
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
