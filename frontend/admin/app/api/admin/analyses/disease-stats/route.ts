import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/types';

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    // 임시 질환별 통계 데이터
    const diseaseStats = [
      { disease: '여드름', count: 150, percentage: 37.5 },
      { disease: '아토피', count: 80, percentage: 20.0 },
      { disease: '습진', count: 60, percentage: 15.0 },
      { disease: '건선', count: 45, percentage: 11.25 },
      { disease: '기타', count: 65, percentage: 16.25 },
    ];

    return NextResponse.json({
      success: true,
      data: diseaseStats
    } as ApiResponse<typeof diseaseStats>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
