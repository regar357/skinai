import { NextRequest, NextResponse } from 'next/server';
import { Disease, ApiResponse } from '@/src/types';

// 임시 질병 데이터
let diseases: Disease[] = [
  {
    disease_id: 1,
    name: '여드름',
    description: '피지선과 모낭의 염증으로 인한 피부 질환',
    symptoms: '면포, 구진, 농포, 결절, 낭종 등의 병변',
    causes: '호르몬 변화, 유전적 요인, 스트레스, 식습관 등',
    treatment: '항생제, 레티노이드, 벤조일 퍼옥사이드 등',
    prevention: '규칙적인 세안, 건강한 식습관, 스트레스 관리',
    created_at: new Date().toISOString(),
  },
  {
    disease_id: 2,
    name: '아토피 피부염',
    description: '만성 재발성 피부염으로 가려움증과 습진을 특징으로 함',
    symptoms: '심한 가려움증, 건조한 피부, 발적, 습진',
    causes: '유전적 요인, 환경적 요인, 면역계 이상',
    treatment: '보습제, 스테로이드 연고, 항히스타민제 등',
    prevention: '보습, 피부 자극 회피, 알레르겐 회피',
    created_at: new Date().toISOString(),
  }
];

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
  return true;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { diseaseId: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const diseaseId = parseInt(params.diseaseId);
    const diseaseIndex = diseases.findIndex(d => d.disease_id === diseaseId);

    if (diseaseIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Disease not found'
      } as ApiResponse<null>, { status: 404 });
    }

    const body = await request.json();

    // 질병 정보 업데이트
    diseases[diseaseIndex] = {
      ...diseases[diseaseIndex],
      ...body,
    };

    return NextResponse.json({
      success: true,
      data: diseases[diseaseIndex],
      message: 'Disease updated successfully'
    } as ApiResponse<Disease>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { diseaseId: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 401 });
    }

    const diseaseId = parseInt(params.diseaseId);
    const diseaseIndex = diseases.findIndex(d => d.disease_id === diseaseId);

    if (diseaseIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Disease not found'
      } as ApiResponse<null>, { status: 404 });
    }

    // 질병 삭제
    diseases.splice(diseaseIndex, 1);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Disease deleted successfully'
    } as ApiResponse<null>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
