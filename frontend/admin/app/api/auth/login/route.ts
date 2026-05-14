import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse, ApiResponse } from '@/src/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api-gateway:3001/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // 실제 백엔드 API 호출
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error?.message || '로그인 실패'
      } as ApiResponse<null>, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: 'Login successful'
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 연결 오류'
    } as ApiResponse<null>, { status: 500 });
  }
}
