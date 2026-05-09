import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse, PaginatedResponse } from '@/src/types';

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
  },
  {
    user_id: 3,
    email: 'suspended@example.com',
    nickname: 'suspended_user',
    status: 'SUSPENDED',
    created_at: new Date().toISOString(),
  },
  {
    user_id: 4,
    email: 'deleted@example.com',
    nickname: 'deleted_user',
    status: 'DELETED',
    created_at: new Date().toISOString(),
  }
];

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  // 실제로는 JWT 토큰 검증 및 관리자 권한 확인
  return true;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // 상태 필터링
    let filteredUsers = users;
    if (status) {
      filteredUsers = users.filter(user => user.status === status);
    }

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        total_pages: Math.ceil(filteredUsers.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<User>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
