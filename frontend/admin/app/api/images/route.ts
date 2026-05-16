import { NextRequest, NextResponse } from 'next/server';
import { Image, ApiResponse } from '@/src/types';

// 임시 이미지 데이터
let images: Image[] = [
  {
    image_id: 1,
    user_id: 2,
    file_url: 'https://example.com/images/1.jpg',
    file_name: 'skin_image_1.jpg',
    file_size: 1024000, // 1MB
    created_at: new Date().toISOString(),
  },
  {
    image_id: 2,
    user_id: 2,
    file_url: 'https://example.com/images/2.jpg',
    file_name: 'skin_image_2.jpg',
    file_size: 800000, // 800KB
    created_at: new Date().toISOString(),
  }
];

let imageIdCounter = 3;

// 임시 인증 미들웨어
function getUserFromToken(request: NextRequest): { user_id: number } | null {
  return { user_id: 2 };
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      } as ApiResponse<null>, { status: 400 });
    }

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only images are allowed.'
      } as ApiResponse<null>, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum 10MB allowed.'
      } as ApiResponse<null>, { status: 400 });
    }

    // 새 이미지 정보 생성 (실제로는 S3에 업로드)
    const newImage: Image = {
      image_id: imageIdCounter++,
      user_id: user.user_id,
      file_url: `https://example.com/images/${imageIdCounter}.jpg`,
      file_name: file.name,
      file_size: file.size,
      created_at: new Date().toISOString(),
    };

    images.push(newImage);

    return NextResponse.json({
      success: true,
      data: newImage,
      message: 'Image uploaded successfully'
    } as ApiResponse<Image>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
