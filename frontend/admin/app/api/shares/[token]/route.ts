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
  }
];

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const share = shares.find(s => s.share_token === token);

    if (!share) {
      return NextResponse.json({
        success: false,
        error: 'Share not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 만료일 확인
    if (new Date(share.expires_at) < new Date()) {
      return NextResponse.json({
        success: false,
        error: 'Share link expired'
      } as ApiResponse<null>, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      data: share
    } as ApiResponse<Share>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const token = params.token;
    const shareIndex = shares.findIndex(s => s.share_token === token);

    if (shareIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Share not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 공유 링크 삭제
    shares.splice(shareIndex, 1);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Share deleted successfully'
    } as ApiResponse<null>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
