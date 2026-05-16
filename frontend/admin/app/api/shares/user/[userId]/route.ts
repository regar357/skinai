import { NextRequest, NextResponse } from 'next/server';
import { Share, ApiResponse } from '@/src/types';

// 임시 공유 데이터
let shares: Share[] = [
  {
    share_id: 1,
    analysis_id: 1,
    share_token: 'abc123',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    share_id: 2,
    analysis_id: 2,
    share_token: 'def456',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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

    // 사용자 본인의 공유 링크만 조회 가능
    if (user.user_id !== userId) {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      } as ApiResponse<null>, { status: 403 });
    }

    // 실제로는 analysis_id를 통해 user_id를 확인해야 함
    // 여기서는 간단히 모든 공유 링크 반환
    return NextResponse.json({
      success: true,
      data: shares
    } as ApiResponse<Share[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
