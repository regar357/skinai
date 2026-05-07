import { NextRequest, NextResponse } from 'next/server';
import { User, SignupRequest, ApiResponse } from '@/src/types';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let users: User[] = [
  {
    user_id: 1,
    email: 'admin@example.com',
    nickname: 'admin',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  }
];
let userIdCounter = 2;

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();

    // 이메일 중복 체크
    const existingUser = users.find(u => u.email === body.email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email already exists'
      } as ApiResponse<null>, { status: 400 });
    }

    // 새 사용자 생성
    const newUser: User = {
      user_id: userIdCounter++,
      email: body.email,
      nickname: body.nickname,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    } as ApiResponse<User>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
