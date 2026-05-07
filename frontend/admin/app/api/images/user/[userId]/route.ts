import { NextRequest, NextResponse } from 'next/server';
import { Image, ApiResponse } from '@/src/types';

// 임시 이미지 데이터
let images: Image[] = [
  {
    image_id: 1,
    user_id: 2,
    file_url: 'https://example.com/images/1.jpg',
    file_name: 'skin_image_1.jpg',
    file_size: 1024000,
    created_at: new Date().toISOString(),
  },
  {
    image_id: 2,
    user_id: 2,
    file_url: 'https://example.com/images/2.jpg',
    file_name: 'skin_image_2.jpg',
    file_size: 800000,
    created_at: new Date().toISOString(),
  },
  {
    image_id: 3,
    user_id: 3,
    file_url: 'https://example.com/images/3.jpg',
    file_name: 'skin_image_3.jpg',
    file_size: 1200000,
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

    // 사용자 본인의 이미지만 조회 가능
    if (user.user_id !== userId) {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      } as ApiResponse<null>, { status: 403 });
    }

    const userImages = images.filter(img => img.user_id === userId);

    return NextResponse.json({
      success: true,
      data: userImages
    } as ApiResponse<Image[]>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
