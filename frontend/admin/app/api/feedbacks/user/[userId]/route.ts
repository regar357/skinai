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
  },
  {
    feedback_id: 3,
    user_id: 2,
    analysis_id: 1,
    content: '두 번째 피드백입니다.',
    rating: 4,
    created_at: new Date().toISOString(),
  }
];

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const userId = parseInt(params.userId);

    // 사용자 본인의 피드백만 조회 가능
    if (user.user_id !== userId) {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      } as ApiResponse<null>, { status: 403 });
    }

    const userFeedbacks = feedbacks.filter(f => f.user_id === userId);

    return NextResponse.json({
      success: true,
      data: userFeedbacks
    } as ApiResponse<Feedback[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
