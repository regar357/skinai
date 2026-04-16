"use client"

import { MeshBackground } from "@/components/mesh-background"
import { SkinAIApp } from "@/components/skin-ai-app"

export default function Page() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      <MeshBackground />
      <SkinAIApp />
    </main>
  )
}
