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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // 임시 일별 활동 통계 데이터 생성
    const dailyActivity = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      dailyActivity.push({
        date: date.toISOString().split('T')[0],
        new_users: Math.floor(Math.random() * 5) + 1,
        analyses: Math.floor(Math.random() * 20) + 5,
        feedbacks: Math.floor(Math.random() * 8) + 1,
      });
    }

    return NextResponse.json({
      success: true,
      data: dailyActivity
    } as ApiResponse<typeof dailyActivity>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
