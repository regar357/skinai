import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse } from '@/src/types';

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
    const level = searchParams.get('level') || 'info';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 임시 로그 데이터 생성
    const logs = [];
    const levels = ['info', 'warn', 'error', 'debug'];
    const messages = [
      'User login successful',
      'Analysis request processed',
      'Database connection established',
      'File upload completed',
      'API rate limit exceeded',
      'Cache cleared successfully',
      'System backup started',
      'Memory usage high',
    ];

    for (let i = 1; i <= 200; i++) {
      const logLevel = levels[Math.floor(Math.random() * levels.length)];
      if (level !== 'all' && logLevel !== level) continue;

      logs.push({
        log_id: i,
        level: logLevel,
        message: messages[Math.floor(Math.random() * messages.length)],
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : undefined,
      });
    }

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        page,
        limit,
        total: logs.length,
        total_pages: Math.ceil(logs.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<any>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
