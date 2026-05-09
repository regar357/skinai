import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse } from '@/src/types';

// 검사기록 타입 정의
interface ExamRecord {
  id: number;
  username: string;
  userId: string;
  examDate: string;
  examType: string;
  result: string;
  confidence: number;
  imageId: string;
}

// 임시 검사기록 데이터
const examRecords: ExamRecord[] = [
  { id: 1000, username: "김민준", userId: "U001", examDate: "2024-07-21", examType: "피부 종양 검사", result: "기저세포암 의심", confidence: 85, imageId: "IMG001" },
  { id: 1001, username: "이서연", userId: "U002", examDate: "2024-07-20", examType: "흑색종 검사", result: "정상 소견", confidence: 95, imageId: "IMG002" },
  { id: 1002, username: "박지호", userId: "U003", examDate: "2024-07-19", examType: "피부 종양 검사", result: "편평세포암 가능성", confidence: 72, imageId: "IMG003" },
  { id: 1003, username: "최수빈", userId: "U004", examDate: "2024-07-18", examType: "반복 검사", result: "치료 후 호전", confidence: 88, imageId: "IMG004" },
  { id: 1004, username: "정현우", userId: "U005", examDate: "2024-07-17", examType: "피부 종양 검사", result: "양성 종양", confidence: 91, imageId: "IMG005" },
  { id: 1005, username: "한소희", userId: "U006", examDate: "2024-07-17", examType: "흑색종 검사", result: "정상 소견", confidence: 97, imageId: "IMG006" },
  { id: 1006, username: "오준혁", userId: "U007", examDate: "2024-07-16", examType: "피부 종양 검사", result: "기저세포암 의심", confidence: 78, imageId: "IMG007" },
  { id: 1007, username: "윤아름", userId: "U008", examDate: "2024-07-15", examType: "반복 검사", result: "경과 관찰 필요", confidence: 65, imageId: "IMG008" },
  { id: 1008, username: "임채원", userId: "U009", examDate: "2024-07-14", examType: "피부 종양 검사", result: "정상 소견", confidence: 92, imageId: "IMG009" },
  { id: 1009, username: "강태양", userId: "U010", examDate: "2024-07-13", examType: "흑색종 검사", result: "흑색종 의심", confidence: 68, imageId: "IMG010" },
  { id: 1010, username: "백하은", userId: "U011", examDate: "2024-07-12", examType: "피부 종양 검사", result: "양성 종양", confidence: 83, imageId: "IMG011" },
  { id: 1011, username: "신동현", userId: "U012", examDate: "2024-07-11", examType: "반복 검사", result: "치료 후 호전", confidence: 90, imageId: "IMG012" },
  { id: 1012, username: "조미래", userId: "U013", examDate: "2024-07-10", examType: "피부 종양 검사", result: "편평세포암 가능성", confidence: 76, imageId: "IMG013" },
  { id: 1013, username: "문지우", userId: "U014", examDate: "2024-07-09", examType: "흑색종 검사", result: "정상 소견", confidence: 96, imageId: "IMG014" },
  { id: 1014, username: "류세진", userId: "U015", examDate: "2024-07-08", examType: "피부 종양 검사", result: "기저세포암 의심", confidence: 81, imageId: "IMG015" },
  { id: 1015, username: "김민준", userId: "U001", examDate: "2024-07-07", examType: "반복 검사", result: "치료 반응 양호", confidence: 93, imageId: "IMG016" },
  { id: 1016, username: "이서연", userId: "U002", examDate: "2024-07-05", examType: "피부 종양 검사", result: "정상 소견", confidence: 98, imageId: "IMG017" },
  { id: 1017, username: "박지호", userId: "U003", examDate: "2024-07-03", examType: "흑색종 검사", result: "경과 관찰 필요", confidence: 70, imageId: "IMG018" },
];

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // 검색 필터링 (사용자명, 사용자ID, 질환 종류)
    let filteredRecords = examRecords;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRecords = examRecords.filter(record => 
        record.username.includes(search) || 
        record.userId.toLowerCase().includes(searchLower) ||
        record.result.toLowerCase().includes(searchLower)
      );
    }

    // 페이징
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedRecords,
      pagination: {
        page,
        limit,
        total: filteredRecords.length,
        total_pages: Math.ceil(filteredRecords.length / limit)
      }
    } as unknown as ApiResponse<PaginatedResponse<ExamRecord>>);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 });
  }
}
