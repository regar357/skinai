import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/types';

// 임시 이미지 데이터
const imageData = {
  IMG001: {
    imageId: "IMG001",
    imageUrl: "https://picsum.photos/seed/skin001/400/300.jpg",
    fileName: "skin_analysis_001.jpg",
    fileSize: 1024576,
    uploadedAt: "2024-07-21T10:30:00Z"
  },
  IMG002: {
    imageId: "IMG002",
    imageUrl: "https://picsum.photos/seed/skin002/400/300.jpg",
    fileName: "skin_analysis_002.jpg",
    fileSize: 892456,
    uploadedAt: "2024-07-20T14:15:00Z"
  },
  IMG003: {
    imageId: "IMG003",
    imageUrl: "https://picsum.photos/seed/skin003/400/300.jpg",
    fileName: "skin_analysis_003.jpg",
    fileSize: 1245678,
    uploadedAt: "2024-07-19T09:45:00Z"
  }
};

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const { imageId } = params;
    const imageInfo = imageData[imageId as keyof typeof imageData];

    if (!imageInfo) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      } as ApiResponse<null>, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: imageInfo
    } as ApiResponse<typeof imageInfo>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
