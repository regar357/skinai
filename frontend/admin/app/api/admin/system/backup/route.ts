import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/types';

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    // 임시 백업 생성 시뮬레이션
    const backupInfo = {
      backup_id: `backup_${Date.now()}`,
      created_at: new Date().toISOString(),
      size: Math.floor(Math.random() * 1000000) + 500000, // 500KB ~ 1.5MB
    };

    return NextResponse.json({
      success: true,
      data: backupInfo,
      message: 'Backup created successfully'
    } as ApiResponse<typeof backupInfo>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
