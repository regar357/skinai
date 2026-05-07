import { NextRequest, NextResponse } from 'next/server';
import { Share, ShareRequest, ApiResponse } from '@/src/types';

// 임시 공유 데이터
let shares: Share[] = [
  {
    share_id: 1,
    analysis_id: 1,
    share_token: 'abc123',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후
    created_at: new Date().toISOString(),
  }
];

let shareIdCounter = 2;

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const analysisId = parseInt(params.analysisId);
    const body: ShareRequest = { analysis_id: analysisId };

    // 토큰 생성
    const shareToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // 새 공유 링크 생성
    const newShare: Share = {
      share_id: shareIdCounter++,
      analysis_id: body.analysis_id,
      share_token: shareToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후 만료
      created_at: new Date().toISOString(),
    };

    shares.push(newShare);

    return NextResponse.json({
      success: true,
      data: newShare,
      message: 'Share link created successfully'
    } as ApiResponse<Share>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
