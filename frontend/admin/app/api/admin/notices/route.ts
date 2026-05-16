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
  }
];

let noticeIdCounter = 3;

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

    const body = await request.json();

    // 새 공지사항 생성
    const newNotice: Notice = {
      notice_id: noticeIdCounter++,
      title: body.title,
      content: body.content,
      is_active: body.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    notices.push(newNotice);

    return NextResponse.json({
      success: true,
      data: newNotice,
      message: 'Notice created successfully'
    } as ApiResponse<Notice>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
