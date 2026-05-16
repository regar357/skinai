import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse } from '@/src/types';

// 임시 사용자 데이터
const users: User[] = [
  {
    user_id: 1,
    email: 'admin@example.com',
    nickname: 'admin',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  },
  {
    user_id: 2,
    email: 'user@example.com',
    nickname: 'user',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  }
];

// 임시 인증 미들웨어 (실제로는 JWT 토큰 검증)
function getUserFromToken(request: NextRequest): User | null {
  // 실제로는 Authorization 헤더에서 토큰 추출 및 검증
  // 여기서는 간단히 첫 번째 사용자를 반환
  return users[0];
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

    return NextResponse.json({
      success: true,
      data: user
    } as ApiResponse<User>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
