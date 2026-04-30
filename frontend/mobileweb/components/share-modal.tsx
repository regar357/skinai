"use client"

import { X, MessageSquare } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareData: {
    title: string
    text: string
    url: string
  }
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  if (!isOpen) return null

  const handleKakaoShare = () => {
    // 카카오톡 앱으로만 공유
    const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`
    const kakaoTalkUrl = `kakaotalk://send/text?msg=${encodeURIComponent(shareText)}`
    
    // 카카오톡 앱 열기
    window.location.href = kakaoTalkUrl
    
    onClose()
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[320px] rounded-[24px] border border-white/40 bg-white/90 p-6 shadow-2xl shadow-blue-200/25 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-foreground">공유하기</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Share Options */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleKakaoShare}
            className="flex flex-col items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 transition-all hover:bg-yellow-100 active:scale-[0.98]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <span className="text-base font-medium text-foreground">카카오톡 공유하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
