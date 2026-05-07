import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/types';

// 임시 인증 미들웨어
function isAdmin(request: NextRequest): boolean {
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

    // 임시 대시보드 통계 데이터
    const dashboardStats = {
      users: {
        total: 150,
        active: 120,
      },
      "analyses": {
        "total": 1250,
        "today": 15,
      },
      charts: [
        {
          type: "line",
          title: "진단 건수",
          data: [
            { month: "2025-12", count: 320 },
            { month: "2026-01", count: 280 },
            { month: "2026-02", count: 350 },
            { month: "2026-03", count: 290 },
            { month: "2026-04", count: 310 }
          ]
        },
        {
          type: "pie",
          title: "질환별 분포",
          data: [
            { disease: "여드름", count: 150, color: "#4CAF50" },
            { disease: "아토피", count: 80, color: "#FF9800" },
            { disease: "습진", count: 60, color: "#2196F3" },
            { disease: "기저세포암", count: 45, color: "#9C27B0" },
            { disease: "편평세포암", count: 35, color: "#F44336" }
          ]
        },
        {
          type: "bar",
          title: "사용자 추이",
          data: [
            { month: "2025-12", active: 120, new: 15 },
            { month: "2026-01", active: 135, new: 18 },
            { month: "2026-02", active: 142, new: 12 },
            { month: "2026-03", active: 148, new: 20 },
            { month: "2026-04", active: 158, new: 25 }
          ]
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats
    } as ApiResponse<typeof dashboardStats>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
