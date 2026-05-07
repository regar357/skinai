import { NextRequest, NextResponse } from 'next/server';
import { AIAnalysisResult, ApiResponse, PaginatedResponse } from '@/src/types';

// 임시 분석 결과 데이터
let analyses: AIAnalysisResult[] = [
  {
    analysis_id: 1,
    image_id: 1,
    user_id: 2,
    result_status: 'NORMAL',
    suspected_disease: '없음',
    confidence_score: 0.95,
    guide_text: '피부 상태가 정상입니다.',
    created_at: new Date().toISOString(),
  },
  {
    analysis_id: 2,
    image_id: 2,
    user_id: 2,
    result_status: 'ABNORMAL',
    suspected_disease: '여드름',
    confidence_score: 0.87,
    guide_text: '여드름 치료가 필요합니다.',
    created_at: new Date().toISOString(),
  },
  {
    analysis_id: 3,
    image_id: 3,
    user_id: 3,
    result_status: 'ABNORMAL',
    suspected_disease: '아토피',
    confidence_score: 0.92,
    guide_text: '피부과 전문의 상담이 필요합니다.',
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
    const status = searchParams.get('status');

    // 상태 필터링
    let filteredAnalyses = analyses;
    if (status) {
      filteredAnalyses = analyses.filter(analysis => analysis.result_status === status);
    }

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnalyses = filteredAnalyses.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAnalyses,
      pagination: {
        page,
        limit,
        total: filteredAnalyses.length,
        total_pages: Math.ceil(filteredAnalyses.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<AIAnalysisResult>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
