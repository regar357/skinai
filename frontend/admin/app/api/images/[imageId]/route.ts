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
  }
];

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const imageId = parseInt(params.imageId);
    const image = images.find(img => img.image_id === imageId && img.user_id === user.user_id);

    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      } as ApiResponse<null>, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: image
    } as ApiResponse<Image>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const imageId = parseInt(params.imageId);
    const imageIndex = images.findIndex(img => img.image_id === imageId && img.user_id === user.user_id);

    if (imageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 이미지 삭제
    images.splice(imageIndex, 1);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Image deleted successfully'
    } as ApiResponse<null>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
