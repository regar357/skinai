import { NextRequest, NextResponse } from 'next/server';
import { Feedback, ApiResponse } from '@/src/types';

// 임시 피드백 데이터
let feedbacks: Feedback[] = [
  {
    feedback_id: 1,
    user_id: 2,
    analysis_id: 1,
    content: '분석 결과가 정확했습니다.',
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    feedback_id: 2,
    user_id: 3,
    analysis_id: 2,
    content: '조금 더 상세한 설명이 필요합니다.',
    rating: 3,
    created_at: new Date().toISOString(),
  }
];

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { feedbackId: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const feedbackId = parseInt(params.feedbackId);
    const { reply_text } = await request.json();

    const feedbackIndex = feedbacks.findIndex(f => f.feedback_id === feedbackId);

    if (feedbackIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Feedback not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 실제로는 별도의 reply 테이블에 저장해야 함
    // 여기서는 간단히 피드백 내용에 답변 추가
    feedbacks[feedbackIndex].content += `\n\n[관리자 답변]: ${reply_text}`;

    return NextResponse.json({
      success: true,
      data: feedbacks[feedbackIndex],
      message: 'Reply added successfully'
    } as ApiResponse<Feedback>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
