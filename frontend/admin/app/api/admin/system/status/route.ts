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

    // 임시 시스템 상태 데이터
    const systemStatus = {
      status: 'healthy',
      database: 'connected',
      storage: 'available',
      ai_service: 'available',
      last_backup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24시간 전
    };

    return NextResponse.json({
      success: true,
      data: systemStatus
    } as ApiResponse<typeof systemStatus>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
