import { NextRequest, NextResponse } from 'next/server';
import { AIAnalysisResult, AnalysisRequest, ApiResponse, PaginatedResponse } from '@/src/types';

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
  }
];

let analysisIdCounter = 3;

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  // 실제로는 JWT 토큰 검증
  return { user_id: 2 }; // 임시로 user_id 2 반환
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

    const body: AnalysisRequest = await request.json();

    // 새 분석 결과 생성 (실제로는 AI 서비스 호출)
    const newAnalysis: AIAnalysisResult = {
      analysis_id: analysisIdCounter++,
      image_id: body.image_id,
      user_id: user.user_id,
      result_status: Math.random() > 0.3 ? 'NORMAL' : 'ABNORMAL',
      suspected_disease: Math.random() > 0.3 ? '없음' : ['여드름', '아토피', '습진', '건선'][Math.floor(Math.random() * 4)],
      confidence_score: Math.random() * 0.3 + 0.7, // 0.7 ~ 1.0
      guide_text: Math.random() > 0.3 ? '피부 상태가 정상입니다.' : '피부과 전문의 상담이 필요합니다.',
      created_at: new Date().toISOString(),
    };

    analyses.push(newAnalysis);

    return NextResponse.json({
      success: true,
      data: newAnalysis,
      message: 'Analysis completed successfully'
    } as ApiResponse<AIAnalysisResult>);

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

    // 사용자별 분석 결과 필터링
    const userAnalyses = analyses.filter(a => a.user_id === user.user_id);

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnalyses = userAnalyses.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAnalyses,
      pagination: {
        page,
        limit,
        total: userAnalyses.length,
        total_pages: Math.ceil(userAnalyses.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<AIAnalysisResult>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
