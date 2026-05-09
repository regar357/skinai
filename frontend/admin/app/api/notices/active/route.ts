import { NextRequest, NextResponse } from 'next/server';
import { Notice, ApiResponse } from '@/src/types';

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

export async function GET(request: NextRequest) {
  try {
    // 활성 공지사항만 필터링
    const activeNotices = notices.filter(notice => notice.is_active);

    return NextResponse.json({
      success: true,
      data: activeNotices
    } as ApiResponse<Notice[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
