"use client"

import { useState } from "react"
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

const hospitalsData = [
  {
    id: 1,
    name: "서울 스킨 클리닉",
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    hours: "09:00 - 18:00",
    rating: 4.8,
    distance: "0.5km",
    isOpen: true,
  },
  {
    id: 2,
    name: "피부과 전문의원",
    address: "서울시 서초구 반포대로 456",
    phone: "02-2345-6789",
    hours: "10:00 - 19:00",
    rating: 4.6,
    distance: "1.2km",
    isOpen: true,
  },
  {
    id: 3,
    name: "연세 피부과",
    address: "서울시 강남구 압구정로 789",
    phone: "02-3456-7890",
    hours: "09:30 - 17:30",
    rating: 4.9,
    distance: "1.8km",
    isOpen: false,
  },
  {
    id: 4,
    name: "삼성 피부과 의원",
    address: "서울시 송파구 올림픽로 321",
    phone: "02-4567-8901",
    hours: "08:30 - 18:30",
    rating: 4.7,
    distance: "2.3km",
    isOpen: true,
  },
]

export function HospitalFinderPage() {
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const sortedHospitals = [...hospitalsData].sort((a, b) => {
    if (sortBy === "distance") return a.distance.localeCompare(b.distance)
    return b.rating - a.rating
  })

  const paginatedHospitals = sortedHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(hospitalsData.length / itemsPerPage)

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          가까운 피부과 찾기
        </h2>
      </div>

      {/* Map placeholder */}
      <div className="relative h-32 overflow-hidden rounded-[22px] border border-white/40 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-medium text-blue-600">현재 위치 기반 검색</p>
          <p className="text-xs text-blue-500/70">서울시 강남구</p>
        </div>
        {/* Decorative dots */}
        <div className="absolute left-8 top-6 h-3 w-3 rounded-full bg-rose-400 shadow-sm" />
        <div className="absolute right-12 top-10 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm" />
        <div className="absolute bottom-8 left-20 h-2 w-2 rounded-full bg-amber-400 shadow-sm" />
        <div className="absolute bottom-12 right-8 h-3 w-3 rounded-full bg-blue-400 shadow-sm" />
      </div>

      {/* Hospital list */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
            검색 결과 ({hospitalsData.length})
          </p>
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline"
          >
            <Navigation className="h-3.5 w-3.5" />
            거리순
          </button>
        </div>

        {paginatedHospitals.map((hospital, i) => (
          <div
            key={hospital.id}
            className="rounded-[22px] border border-white/40 bg-white/60 p-5 shadow-lg shadow-blue-100/15 backdrop-blur-xl transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {hospital.name}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      hospital.isOpen
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {hospital.isOpen ? "영업중" : "영업종료"}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {hospital.address}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {hospital.hours}
                  </p>
                </div>
              </div>

              {/* Rating & distance */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-600">{hospital.rating}</span>
                </div>
                <span className="text-sm font-semibold text-blue-500">{hospital.distance}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <Phone className="h-3.5 w-3.5" />
                전화하기
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                길찾기
              </button>
            </div>
          </div>
        ))}

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
      </div>
    </div>
  )
}
