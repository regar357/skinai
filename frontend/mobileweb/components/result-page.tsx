"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share2, MapPin, Download } from "lucide-react"
import { ShareModal } from "@/components/share-modal"
import { generateDirectPDF, downloadPDF } from "@/utils/direct-pdf"
import { diagnosisService } from "@/lib/api-services"

interface ResultData {
  imagePreview: string
  diagnosisId?: number
  suspectedDisease?: string
  probability?: number
}

interface ResultPageProps {
  data: ResultData
  onBack: () => void
  onFindHospital?: () => void
}

function getColorConfig(probability: number) {
  if (probability >= 70) {
    return {
      color: "rgb(239, 68, 68)", // red-500
      badgeBg: "bg-red-50 text-red-600 border-red-200/60",
    }
  } else if (probability >= 30) {
    return {
      color: "rgb(249, 115, 22)", // orange-500
      badgeBg: "bg-orange-50 text-orange-600 border-orange-200/60",
    }
  }
  return {
    color: "rgb(34, 197, 94)", // emerald-500
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  }
}

function ProbabilityRing({ probability }: { probability: number }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)
  const colorConfig = getColorConfig(probability)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (probability / 100) * circumference)
    }, 200)
    return () => clearTimeout(timer)
  }, [probability, circumference])

  return (
    <div className="relative">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgb(226 232 240)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colorConfig.color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold text-foreground">
          <AnimatedProbability target={probability} />
        </div>
        <div className="text-xs font-medium text-muted-foreground">확률</div>
      </div>
    </div>
  )
}

function AnimatedProbability({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frame: number
    const duration = 1200
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return <span>{count}%</span>
}

export function ResultPage({ data, onBack, onFindHospital }: ResultPageProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [resultData, setResultData] = useState(data)

  useEffect(() => {
    setResultData(data)
  }, [data])

  useEffect(() => {
    const diagnosisId = data.diagnosisId
    if (!diagnosisId) return

    const loadDetail = async () => {
      try {
        const detail = await diagnosisService.getById(diagnosisId)
        setResultData((prev) => ({
          ...prev,
          diagnosisId: detail.diagnosisId,
          suspectedDisease: detail.result?.suspectedDisease || prev.suspectedDisease,
          probability: detail.result?.probability ?? prev.probability,
        }))
      } catch {
        // 상세 API 실패 시 최초 분석 응답값을 그대로 사용한다.
      }
    }

    void loadDetail()
  }, [data.diagnosisId])

  const suspectedDisease = resultData.suspectedDisease || "기저세포암"
  const probability = resultData.probability ?? 78
  const summary = `의심 질환: ${suspectedDisease} (${probability}% 확률)`

  const handleDownload = () => {
    // 진단 결과 데이터 구성
    const reportData = {
      date: new Date().toLocaleDateString('ko-KR'),
      result: suspectedDisease,
      score: probability,
      summary,
      details: {
        probability,
      },
      generatedAt: new Date().toISOString()
    }
    
    // PDF 생성 및 다운로드
    const pdfData = generateDirectPDF(reportData)
    const filename = `skinai-result-${new Date().toISOString().split('T')[0]}.pdf`
    const success = downloadPDF(pdfData, filename)
    
    // 토스트 메시지 표시
    const toast = document.createElement('div')
    toast.textContent = success ? 'PDF 파일 다운로드가 되었습니다.' : 'PDF 파일이 새 창에서 열렸습니다. 저장을 선택해주세요.'
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

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="group flex items-center gap-2 self-start rounded-2xl border border-white/40 bg-white/60 px-4 py-2.5 text-sm font-bold text-foreground shadow-md backdrop-blur-xl transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.97]"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        다시 진단하기
      </button>

      {/* Main result card */}
      <div className="w-full rounded-[28px] border border-white/40 bg-white/60 p-7 shadow-2xl shadow-blue-200/25 backdrop-blur-xl">
        {/* Uploaded photo */}
        <div className="relative mb-7 overflow-hidden rounded-3xl shadow-lg shadow-blue-200/30">
          <img
            src={resultData.imagePreview}
            alt="Analyzed skin photo"
            className="h-52 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-blue-500/5 pointer-events-none" />
        </div>

        {/* Probability ring */}
        <div className="flex flex-col items-center gap-4">
          <ProbabilityRing probability={probability} />

          {/* Disease name */}
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-foreground">
              {suspectedDisease}
            </h3>
          </div>
        </div>
      </div>


      {/* Action buttons */}
      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 py-3.5 text-base font-medium tracking-wide text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
        >
          <Share2 className="h-5 w-5 text-slate-500" />
          공유하기
        </button>

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareData={{
            title: "SkinAI 피부 진단 결과",
            text: summary,
            url: window.location.href,
          }}
        />
        <button
          type="button"
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 py-3.5 text-base font-medium tracking-wide text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
        >
          <Download className="h-5 w-5 text-slate-500" />
          저장하기
        </button>
        <button
          type="button"
          onClick={onFindHospital}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 py-3.5 text-base font-medium tracking-wide text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
        >
          <MapPin className="h-5 w-5 text-slate-500" />
          피부과 찾기
        </button>
      </div>
    </div>
  )
}
