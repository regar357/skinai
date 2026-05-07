import { NextRequest, NextResponse } from 'next/server';
import { Feedback, FeedbackRequest, ApiResponse, PaginatedResponse } from '@/src/types';

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

let feedbackIdCounter = 3;

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const body: FeedbackRequest = await request.json();

    // 새 피드백 생성
    const newFeedback: Feedback = {
      feedback_id: feedbackIdCounter++,
      user_id: user.user_id,
      analysis_id: body.analysis_id,
      content: body.content,
      rating: body.rating,
      created_at: new Date().toISOString(),
    };

    feedbacks.push(newFeedback);

    return NextResponse.json({
      success: true,
      data: newFeedback,
      message: 'Feedback created successfully'
    } as ApiResponse<Feedback>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 사용자별 피드백 필터링
    const userFeedbacks = feedbacks.filter(f => f.user_id === user.user_id);

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedbacks = userFeedbacks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedFeedbacks,
      pagination: {
        page,
        limit,
        total: userFeedbacks.length,
        total_pages: Math.ceil(userFeedbacks.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<Feedback>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
