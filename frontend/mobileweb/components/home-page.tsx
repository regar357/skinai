"use client"

import { useState, useRef, useCallback } from "react"
import { Sparkles, Loader2, Camera, UploadCloud, X, User2, Calendar } from "lucide-react"

interface Ripple {
  id: number
  x: number
  y: number
}

interface HomePageProps {
  onAnalysisComplete?: (data: { imagePreview: string; gender: string; age: string }) => void
}

export function HomePage({ onAnalysisComplete }: HomePageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showScanIndicator, setShowScanIndicator] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const isReady = !!imagePreview && !!gender && !!age

  const spawnRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const ripple: Ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setRipples((prev) => [...prev, ripple])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 700)
  }, [])

  const handleAnalyze = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isReady || isLoading) return
    spawnRipple(e)
    setIsLoading(true)
    setShowScanIndicator(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowScanIndicator(false)
      if (imagePreview && gender && age) {
        onAnalysisComplete?.({ imagePreview, gender, age })
      }
    }, 2500)
  }

  return (
    <div className="flex w-full max-w-[400px] flex-1 flex-col items-center justify-center">
      {/* Glassmorphism card */}
      <div className="w-full rounded-[24px] border border-white/40 bg-white/60 p-6 shadow-2xl shadow-blue-200/25 backdrop-blur-xl">
        {/* Card header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            피부 진단 시작하기
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {/* Upload area */}
          {!imagePreview ? (
            <label
              className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 transition-all hover:border-blue-400 hover:bg-blue-50/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-500 transition-transform group-hover:scale-110">
                <UploadCloud className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">사진 업로드</p>
              </div>
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 w-full object-cover"
              />
              {/* Scanning animation - only show when diagnosis is in progress */}
              {showScanIndicator && (
                <div className="animate-scan-line pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent shadow-[0_0_15px_3px_rgba(59,130,246,0.5)]" />
              )}
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* User info row */}
          <div className="flex gap-4">
            {/* Gender select */}
            <div className="flex-1">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User2 className="h-4 w-4" />
                성별
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-base font-medium text-foreground focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              >
                <option value="">선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            {/* Age input */}
            <div className="flex-1">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                나이
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="예: 25"
                min={1}
                max={120}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-base font-medium text-foreground placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
            </div>
          </div>

          {/* Submit button with ripple */}
          <button
            ref={btnRef}
            type="button"
            onClick={handleAnalyze}
            disabled={!isReady || isLoading}
            className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 text-xl font-bold tracking-wide transition-all duration-300 ${
              isReady && !isLoading
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                : isLoading
                ? "cursor-wait bg-gradient-to-r from-blue-400 to-indigo-500 text-white/90"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                className="animate-ripple pointer-events-none absolute h-4 w-4 rounded-full bg-white/30"
                style={{ left: r.x - 8, top: r.y - 8 }}
              />
            ))}

            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                AI 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                AI 피부 진단 시작
              </>
            )}
          </button>

          {/* Hint text */}
        </div>
      </div>
    </div>
  )
}
