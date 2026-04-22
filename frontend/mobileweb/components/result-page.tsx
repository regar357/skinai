"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Share2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Sun,
  Layers,
  Download,
  CheckCircle2,
} from "lucide-react"

interface ResultData {
  imagePreview: string
  gender: string
  age: string
}

interface ResultPageProps {
  data: ResultData
  onBack: () => void
  onFindHospital?: () => void
}

/* Simulated AI results */
const overallScore = 85
const diagnosisItems = [
  {
    label: "수분 보유도",
    score: 78,
    icon: Droplets,
    color: "from-cyan-400 to-blue-500",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-500",
  },
  {
    label: "UV 손상도",
    score: 32,
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    label: "피부 장벽",
    score: 91,
    icon: Layers,
    color: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    label: "피지 균형",
    score: 64,
    icon: TrendingUp,
    color: "from-violet-400 to-indigo-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
]

function AnimatedScore({ target }: { target: number }) {
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

  return <span>{count}</span>
}

function ScoreRing({ score }: { score: number }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference)
    }, 200)
    return () => clearTimeout(timer)
  }, [score, circumference])

  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-100"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-[1.2s] ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">
          <AnimatedScore target={score} />
        </span>
        <span className="text-xs font-bold tracking-wide text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

export function ResultPage({ data, onBack, onFindHospital }: ResultPageProps) {
  const isGood = overallScore >= 70

  const handleDownload = () => {
    const resultText = `
SkinAI 피부 진단 결과
====================
날짜: ${new Date().toLocaleDateString("ko-KR")}
성별: ${data.gender === "male" ? "남성" : "여성"}
나이: ${data.age}세

종합 점수: ${overallScore}점

세부 항목:
- 수분 보유도: 78%
- UV 손상도: 32%
- 피부 장벽: 91%
- 피지 균형: 64%

상태: ${isGood ? "양호한 피부 상태" : "주의 필요"}

※ 본 결과는 AI 분석 결과이며, 정확한 진단은 전문 의료진과 상담하세요.
    `.trim()

    const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skinai-result-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareData = {
      title: "SkinAI 피부 진단 결과",
      text: `AI 피부 진단 결과: ${overallScore}점 (${isGood ? "양호" : "주의 필요"})`,
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      alert("결과가 클립보드에 복사되었습니다!")
    }
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
            src={data.imagePreview}
            alt="Analyzed skin photo"
            className="h-52 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-blue-500/5 pointer-events-none" />
          {/* User info badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-4 py-1.5 text-xs font-bold shadow-md backdrop-blur-md">
            <span className="text-foreground">
              {data.gender === "male" ? "남성" : "여성"} / {data.age}세
            </span>
          </div>
        </div>

        {/* Score ring */}
        <div className="flex flex-col items-center gap-4">
          <ScoreRing score={overallScore} />

          {/* Status badge */}
          <div
            className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold shadow-sm ${
              isGood
                ? "border-emerald-200/60 bg-emerald-50 text-emerald-600"
                : "border-amber-200/60 bg-amber-50 text-amber-600"
            }`}
          >
            {isGood ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {isGood ? "양호한 피부 상태" : "주의 필요"}
          </div>

          <p className="text-center text-sm leading-relaxed text-muted-foreground px-2">
            AI 분석 결과, 전반적으로{" "}
            <strong className="text-foreground">양호한 피부 상태</strong>입니다.
            다만 UV 보호에 신경을 써주시면 더 건강한 피부를 유지할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Detail breakdown */}
      <div className="w-full rounded-[28px] border border-white/40 bg-white/60 p-6 shadow-2xl shadow-blue-200/25 backdrop-blur-xl">
        <h3 className="mb-5 text-base font-extrabold tracking-tight text-foreground">
          세부 분석 항목
        </h3>
        <div className="flex flex-col gap-4">
          {diagnosisItems.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-4"
              >
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${item.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${item.iconColor}`} strokeWidth={1.8} />
                </span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-tight text-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-foreground">
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
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
