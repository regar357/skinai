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

    // 임시 피드백 통계 데이터
    const stats = {
      total_feedbacks: 850,
      average_rating: 4.2,
      rating_distribution: {
        1: 25,
        2: 45,
        3: 120,
        4: 280,
        5: 380
      },
      feedbacks_today: 8,
      feedbacks_this_month: 95,
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
