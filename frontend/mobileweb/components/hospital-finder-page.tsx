"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { hospitalService } from "@/lib/api-services";

type HospitalCard = {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  hours: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
};

type LocationPoint = {
  lat: number;
  lng: number;
};

const DEFAULT_LOCATION: LocationPoint = {
  lat: 37.4979,
  lng: 127.0276,
};

async function getLocationByIp(): Promise<LocationPoint | null> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = await res.json() as { latitude?: number; longitude?: number };
    if (typeof data.latitude === "number" && typeof data.longitude === "number") {
      return { lat: data.latitude, lng: data.longitude };
    }
    return null;
  } catch {
    return null;
  }
}

function getPhoneHref(phone: string | null) {
  const digits = phone?.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getMapUrl(hospital: HospitalCard, origin: LocationPoint) {
  if (hospital.latitude && hospital.longitude) {
    const slng = origin.lng.toFixed(5);
    const slat = origin.lat.toFixed(5);
    const dlng = Number(hospital.longitude).toFixed(5);
    const dlat = Number(hospital.latitude).toFixed(5);
    const sname = encodeURIComponent("현재위치");
    const dname = encodeURIComponent(hospital.name);

    // 출발지-도착지 중간점을 지도 초기 중심으로 설정 (없으면 길찾기 패널이 뜨지 않음)
    const clng = ((origin.lng + Number(hospital.longitude)) / 2).toFixed(5);
    const clat = ((origin.lat + Number(hospital.latitude)) / 2).toFixed(5);

    return `https://map.naver.com/p/directions/${slng},${slat},${sname},,/${dlng},${dlat},${dname},,/car?c=${clng},${clat},13,0,0,0,dh`;
  }

  return (
    hospital.mapUrl ||
    `https://map.naver.com/p/search/${encodeURIComponent(`${hospital.name} ${hospital.address}`)}`
  );
}

function getHospitalInfoUrl(hospital: HospitalCard) {
  return (
    hospital.mapUrl ||
    `https://map.naver.com/p/search/${encodeURIComponent(hospital.name)}`
  );
}

export function HospitalFinderPage() {
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [hospitals, setHospitals] = useState<HospitalCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentLocation, setCurrentLocation] =
    useState<LocationPoint>(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState("내 위치 확인 중...");
  const [locationReady, setLocationReady] = useState(false);
  const addressRef = useRef<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLabel("서울시 강남구");
      setLocationReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          const result = await hospitalService.reverseGeocode(
            nextLocation.lat,
            nextLocation.lng,
          );
          const label = result.address || "현재 위치";
          addressRef.current = label !== "현재 위치" ? label : undefined;
          setLocationLabel(label);
        } catch {
          setLocationLabel("현재 위치");
        } finally {
          setCurrentLocation(nextLocation);
          setLocationReady(true);
        }
      },
      async () => {
        const ipLoc = await getLocationByIp();
        if (ipLoc) {
          try {
            const result = await hospitalService.reverseGeocode(ipLoc.lat, ipLoc.lng);
            const label = result.address || "현재 위치";
            addressRef.current = label !== "현재 위치" ? label : undefined;
            setLocationLabel(label);
          } catch {
            setLocationLabel("현재 위치");
          } finally {
            setCurrentLocation(ipLoc);
          }
        } else {
          addressRef.current = "서울시 강남구";
          setLocationLabel("서울시 강남구");
        }
        setLocationReady(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    if (!locationReady) return;

    const loadHospitals = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await hospitalService.getNearby({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          sort: sortBy,
          page: currentPage,
          size: itemsPerPage,
          address: addressRef.current,
        });
        const mapped = response.items.map((item) => ({
          id: item.id,
          name: item.name,
          address: item.address,
          phone: item.phone || null,
          hours: item.hours,
          rating: item.rating,
          distance: `${item.distanceKm}km`,
          isOpen: item.isOpen,
          latitude: item.latitude,
          longitude: item.longitude,
          mapUrl: item.mapUrl,
        }));
        setHospitals(mapped);
        setTotalCount(response.pagination?.totalItems ?? mapped.length);
      } catch {
        setHospitals([]);
        setTotalCount(0);
        setErrorMessage("병원 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadHospitals();
  }, [sortBy, currentPage, currentLocation, locationReady]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const handlePhoneClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    phone: string | null,
  ) => {
    if (!phone) {
      event.preventDefault();
      return;
    }

    if (isMobileDevice()) return;

    event.preventDefault();
    try {
      await navigator.clipboard?.writeText(phone);
      alert(`전화번호가 복사되었습니다.\n${phone}`);
    } catch {
      alert(`전화번호: ${phone}`);
    }
  };

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
          <p className="text-sm font-medium text-blue-600">
            현재 위치 기반 검색
          </p>
          <p className="text-xs text-blue-500/70">{locationLabel}</p>
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
            검색 결과 ({totalCount})
          </p>
          <button
            type="button"
            onClick={() => {
              setSortBy((prev) =>
                prev === "distance" ? "rating" : "distance",
              );
              setCurrentPage(1);
            }}
            className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline"
          >
            <Navigation className="h-3.5 w-3.5" />
            {sortBy === "distance" ? "거리순" : "평점순"}
          </button>
        </div>

        {isLoading && (
          <div className="rounded-[22px] border border-white/40 bg-white/60 p-6 text-center shadow-lg shadow-blue-100/15 backdrop-blur-xl">
            <p className="text-sm font-semibold text-slate-600">
              주변 병원을 검색 중입니다.
            </p>
          </div>
        )}

        {!isLoading && hospitals.length === 0 && (
          <div className="rounded-[22px] border border-white/40 bg-white/60 p-6 text-center shadow-lg shadow-blue-100/15 backdrop-blur-xl">
            <p className="text-sm font-semibold text-slate-700">
              {errorMessage ?? "현재 위치 주변에 등록된 병원이 없습니다."}
            </p>
          </div>
        )}

        {!isLoading &&
          hospitals.map((hospital) => (
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
                    <span className="text-sm font-bold text-amber-600">
                      {hospital.rating}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-500">
                    {hospital.distance}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <a
                  href={
                    hospital.phone
                      ? getPhoneHref(hospital.phone)
                      : getHospitalInfoUrl(hospital)
                  }
                  onClick={
                    hospital.phone
                      ? (event) => handlePhoneClick(event, hospital.phone)
                      : undefined
                  }
                  aria-label={
                    hospital.phone
                      ? `${hospital.name} 전화하기`
                      : `${hospital.name} 전화번호 확인하기`
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {hospital.phone ? "전화하기" : "전화번호 확인"}
                </a>
                <a
                  href={getMapUrl(hospital, currentLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${hospital.name} 길찾기`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  길찾기
                </a>
              </div>
            </div>
          ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-100 disabled:opacity-50"
              aria-label="이전 페이지"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-base font-bold transition-all ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "border border-white/40 bg-white/60 text-slate-500 shadow-sm backdrop-blur-sm hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
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
  );
}
