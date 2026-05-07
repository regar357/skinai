import { NextRequest, NextResponse } from 'next/server';
import { User, LoginRequest, LoginResponse, ApiResponse } from '@/src/types';

// 관리자 계정
const adminUsers: User[] = [
  {
    user_id: 1,
    email: 'admin@example.com',
    nickname: 'admin',
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

    // 관리자 인증
    const adminUser = adminUsers.find(u => u.email === body.email);
    if (!adminUser || adminUser.status !== 'ACTIVE') {
      return NextResponse.json({
        success: false,
        error: 'Invalid admin credentials'
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
        user: adminUser
      } as LoginResponse,
      message: 'Admin login successful'
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
