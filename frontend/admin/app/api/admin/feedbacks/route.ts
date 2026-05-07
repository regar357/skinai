import { NextRequest, NextResponse } from 'next/server';
import { Feedback, ApiResponse, PaginatedResponse } from '@/src/types';

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
    analysis_id: 3,
    content: '아주 만족스러운 서비스입니다.',
    rating: 5,
    created_at: new Date().toISOString(),
  }
];

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const status = searchParams.get('status');

    // 평점 필터링
    let filteredFeedbacks = feedbacks;
    if (rating) {
      const ratingNum = parseInt(rating);
      filteredFeedbacks = feedbacks.filter(feedback => feedback.rating === ratingNum);
    }

    // 상태 필터링 (pending/answered)
    if (status) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => {
        const hasReply = feedback.content.includes('[관리자 답변]:');
        return status === 'pending' ? !hasReply : hasReply;
      });
    }

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedFeedbacks,
      pagination: {
        page,
        limit,
        total: filteredFeedbacks.length,
        total_pages: Math.ceil(filteredFeedbacks.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<Feedback>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
