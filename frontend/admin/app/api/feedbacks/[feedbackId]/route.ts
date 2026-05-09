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
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { feedbackId: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const feedbackId = parseInt(params.feedbackId);
    const feedbackIndex = feedbacks.findIndex(f => f.feedback_id === feedbackId && f.user_id === user.user_id);

    if (feedbackIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Feedback not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 피드백 삭제
    feedbacks.splice(feedbackIndex, 1);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Feedback deleted successfully'
    } as ApiResponse<null>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
