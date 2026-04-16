"use client"

import { useState } from "react"
import { ChevronDown, BookOpen, AlertCircle, CheckCircle2, Info, ChevronRight } from "lucide-react"

const encyclopediaData = [
  {
    id: 1,
    title: "피부 종양이란?",
    icon: BookOpen,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    content:
      "피부 종양은 피부 세포의 비정상적인 성장으로 발생하는 덩어리입니다. 양성(비암성)과 악성(암성)으로 나뉘며, 대부분의 피부 종양은 양성입니다. 조기 발견과 정기적인 검진이 중요합니다.",
  },
  {
    id: 2,
    title: "양성 종양의 종류",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    content:
      "대표적인 양성 종양으로는 지루성 각화증(노인성 사마귀), 피부 섬유종, 지방종, 혈관종 등이 있습니다. 이들은 대부분 건강에 해롭지 않지만, 미용적 이유나 불편함이 있을 경우 제거할 수 있습니다.",
  },
  {
    id: 3,
    title: "악성 종양(피부암) 경고 신호",
    icon: AlertCircle,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    content:
      "ABCDE 법칙으로 확인하세요: A(비대칭) - 모양이 대칭적이지 않음, B(경계) - 가장자리가 불규칙함, C(색상) - 여러 색이 섞여 있음, D(직경) - 6mm 이상, E(변화) - 크기, 모양, 색상이 변함. 이 중 하나라도 해당되면 전문의 상담을 권장합니다.",
  },
  {
    id: 4,
    title: "자외선과 피부 건강",
    icon: Info,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    content:
      "자외선(UV)은 피부 노화와 피부암의 주요 원인입니다. SPF 30 이상의 자외선 차단제를 매일 바르고, 오전 10시~오후 4시 사이 직사광선을 피하세요. 모자와 긴 소매 옷도 효과적인 보호 수단입니다.",
  },
  {
    id: 5,
    title: "정기 검진의 중요성",
    icon: BookOpen,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    content:
      "매월 전신 피부 자가 검진을 하고, 연 1회 피부과 전문의 검진을 받는 것이 좋습니다. 특히 가족력이 있거나, 점이 많거나, 햇볕에 많이 노출되는 분들은 더 자주 검진받으시기 바랍니다.",
  },
  {
    id: 6,
    title: "기저세포암",
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    content:
      "가장 흔한 피부암 종류입니다. 주로 햇볕에 노출되는 얼굴, 목, 팔에 발생하며, 진주색이나 왁스 같은 돌기로 나타납니다. 성장이 느리고 전이는 드물지만 조기 치료가 중요합니다.",
  },
  {
    id: 7,
    title: "편평세포암",
    icon: AlertCircle,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    content:
      "두 번째로 흔한 피부암입니다. 각질화된 붉은 반점이나 돌기로 나타나며, 궤양을 형성할 수 있습니다. 기저세포암보다 전이 가능성이 높아 주의 깊은 관찰이 필요합니다.",
  },
  {
    id: 8,
    title: "흑색종",
    icon: AlertCircle,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    content:
      "가장 위험한 피부암입니다. 멜라닌 생성 세포에서 발생하며, 색소가 있는 점이나 얼룩으로 나타납니다. 조기 발견 시 생존율이 높지만, 전이가 빠르므로 즉각적인 치료가 필요합니다.",
  },
]

export function EncyclopediaPage() {
  const [openId, setOpenId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  const paginatedData = encyclopediaData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(encyclopediaData.length / itemsPerPage)

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          피부종양 기초 백과
        </h2>
      </div>

      {/* Accordion list */}
      <div className="flex flex-col gap-3">
        {paginatedData.map((item, i) => {
          const Icon = item.icon
          const isOpen = openId === item.id
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-[22px] border border-white/40 bg-white/60 shadow-lg shadow-blue-100/15 backdrop-blur-xl transition-all"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-slate-50/50"
                aria-expanded={isOpen}
              >
                <span
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${item.iconBg} transition-transform ${
                    isOpen ? "scale-110" : ""
                  }`}
                >
                  <Icon className={`h-6 w-6 ${item.iconColor}`} strokeWidth={1.8} />
                </span>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <div className="pl-[60px]">
                    <p className="text-base font-medium leading-relaxed text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              )}
            </div>
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

      {/* Disclaimer */}
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/80 p-4 text-center">
        <p className="text-sm leading-relaxed text-amber-700">
          본 정보는 참고용이며, 정확한 진단은 반드시 전문 의료진과 상담하세요.
        </p>
      </div>
    </div>
  )
}
