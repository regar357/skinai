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

    // 임시 통계 데이터
    const stats = {
      total_analyses: 1250,
      normal_count: 850,
      abnormal_count: 400,
      average_confidence: 0.89,
      analyses_today: 15,
      analyses_this_month: 320,
    };

    return NextResponse.json({
      success: true,
      data: stats
    } as ApiResponse<typeof stats>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
