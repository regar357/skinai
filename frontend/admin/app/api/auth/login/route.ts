import { NextRequest, NextResponse } from 'next/server';
import { User, LoginRequest, LoginResponse, ApiResponse } from '@/src/types';

// 임시 데이터 저장소
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

// 임시 토큰 생성 함수
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // 사용자 인증 (실제로는 비밀번호 해시 검증)
    const user = users.find(u => u.email === body.email);
    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<null>, { status: 401 });
    }

    // 토큰 생성
    const accessToken = generateToken();
    const refreshToken = generateToken();

    return NextResponse.json({
      success: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user
      } as LoginResponse,
      message: 'Login successful'
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
