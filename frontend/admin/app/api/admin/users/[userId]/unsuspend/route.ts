import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse } from '@/src/types';

// 임시 사용자 데이터
let users: User[] = [
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

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const userId = parseInt(params.userId);
    const userIndex = users.findIndex(u => u.user_id === userId);

    if (userIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 사용자 상태를 ACTIVE로 변경
    users[userIndex].status = 'ACTIVE';

    return NextResponse.json({
      success: true,
      data: users[userIndex],
      message: 'User unsuspended successfully'
    } as ApiResponse<User>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
