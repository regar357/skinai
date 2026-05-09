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

export async function GET(
  request: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  try {
    const analysisId = parseInt(params.analysisId);
    const analysisFeedbacks = feedbacks.filter(f => f.analysis_id === analysisId);

    return NextResponse.json({
      success: true,
      data: analysisFeedbacks
    } as ApiResponse<Feedback[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
