import { NextRequest, NextResponse } from 'next/server';
import { Hospital, ApiResponse } from '@/src/types';

// 임시 병원 데이터
let hospitals: Hospital[] = [
  {
    hospital_id: 1,
    name: '서울피부과',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-123-4567',
    latitude: 37.5172,
    longitude: 127.0473,
    department: '피부과',
  },
  {
    hospital_id: 2,
    name: '강남피부과의원',
    address: '서울시 강남구 역삼동 456',
    phone: '02-987-6543',
    latitude: 37.5003,
    longitude: 127.0364,
    department: '피부과',
  },
  {
    hospital_id: 3,
    name: '분당피부과',
    address: '경기도 성남시 분당구 서현동 789',
    phone: '031-123-4567',
    latitude: 37.3845,
    longitude: 127.1223,
    department: '피부과',
  }
];

let hospitalIdCounter = 4;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const radius = searchParams.get('radius');
    const department = searchParams.get('department');

    let filteredHospitals = hospitals;

    // 진료과 필터링
    if (department) {
      filteredHospitals = filteredHospitals.filter(h => h.department === department);
    }

    // 거리 기반 필터링 (간단한 구현)
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const maxDistance = parseFloat(radius);

      filteredHospitals = filteredHospitals.filter(hospital => {
        const distance = calculateDistance(lat, lng, hospital.latitude, hospital.longitude);
        return distance <= maxDistance;
      });
    }

    return NextResponse.json({
      success: true,
      data: filteredHospitals
    } as ApiResponse<Hospital[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}

// 간단한 거리 계산 함수 (하버사인 공식)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // km
}
