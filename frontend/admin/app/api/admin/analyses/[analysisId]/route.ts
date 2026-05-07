import { NextRequest, NextResponse } from 'next/server';
import { AIAnalysisResult, ApiResponse } from '@/src/types';

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

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const analysisId = parseInt(params.analysisId);
    const analysisIndex = analyses.findIndex(a => a.analysis_id === analysisId);

    if (analysisIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Analysis not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 분석 결과 삭제
    analyses.splice(analysisIndex, 1);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Analysis deleted successfully'
    } as ApiResponse<null>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
