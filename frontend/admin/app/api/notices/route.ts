import { NextRequest, NextResponse } from 'next/server';
import { Notice, ApiResponse, PaginatedResponse } from '@/src/types';

// 임시 공지사항 데이터
let notices: Notice[] = [
  {
    notice_id: 1,
    title: '시스템 점검 안내',
    content: '오늘 밤 11시부터 내일 새벽 2시까지 시스템 점검이 예정되어 있습니다.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    notice_id: 2,
    title: '신규 기능 업데이트',
    content: 'AI 분석 정확도가 향상되었습니다.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    notice_id: 3,
    title: '이전 공지사항',
    content: '이전 공지사항 내용입니다.',
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let noticeIdCounter = 4;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotices = notices.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedNotices,
      pagination: {
        page,
        limit,
        total: notices.length,
        total_pages: Math.ceil(notices.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<Notice>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
