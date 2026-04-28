"use client"

import { ScanFace } from "lucide-react"

export function SkinLogo() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Icon with circular glow background */}
      <div className="relative">
        <div className="absolute inset-0 scale-150 rounded-full bg-blue-400/15 blur-2xl" aria-hidden="true" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30">
          <ScanFace className="h-12 w-12 text-white" strokeWidth={1.7} />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Skin<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">AI</span>
        </h1>
      </div>
    </div>
  )
}
