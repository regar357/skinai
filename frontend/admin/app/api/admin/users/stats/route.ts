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
      total_users: 150,
      active_users: 120,
      suspended_users: 25,
      deleted_users: 5,
      new_users_today: 3,
      new_users_this_month: 28,
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
