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
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { hospitalId: string } }
) {
  try {
    const hospitalId = parseInt(params.hospitalId);
    const hospital = hospitals.find(h => h.hospital_id === hospitalId);

    if (!hospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found'
      } as ApiResponse<null>, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: hospital
    } as ApiResponse<Hospital>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
