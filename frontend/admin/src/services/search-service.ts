import { APP_CONFIG } from '@/src/config/app-config';
import { usersApi, User } from '@/src/api/users';
import { contentApi } from '@/src/api/content';
import { analysisApi } from '@/src/api/analysis';

// 목업 데이터 인터페이스
export interface MockUser {
  id: number;
  username: string;
  email: string;
  status: "활성" | "정지" | "삭제";
  joinDate: string;
  lastLogin: string;
  analysisCount: number;
}

export interface MockNotice {
  notice_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface MockEncyclopediaEntry {
  id: number;
  title: string;
  description: string;
  modifiedDate: string;
}

export interface MockExamRecord {
  id: number;
  username: string;
  userId: string;
  examDate: string;
  examType: string;
  result: string;
  confidence: number;
  imageId: string;
}

// 검색 결과 인터페이스
export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 검색 파라미터 인터페이스
export interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}

// 목업 데이터 제공자
class MockDataProvider {
  private static users: MockUser[] = [
    { id: 1,  username: "김민준", email: "minjun.kim@example.com",   status: "활성", joinDate: "2024-01-15", lastLogin: "2024-07-21", analysisCount: 25 },
    { id: 2,  username: "이서연", email: "seoyeon.lee@example.com",  status: "정지", joinDate: "2024-02-20", lastLogin: "2024-07-18", analysisCount: 12 },
    { id: 3,  username: "박지호", email: "jiho.park@example.com",    status: "활성", joinDate: "2024-03-10", lastLogin: "2024-07-21", analysisCount: 8  },
    { id: 4,  username: "최수빈", email: "subin.choi@example.com",   status: "활성", joinDate: "2024-03-22", lastLogin: "2024-07-20", analysisCount: 34 },
    { id: 5,  username: "정현우", email: "hyunwoo.jung@example.com", status: "정지", joinDate: "2024-04-05", lastLogin: "2024-06-30", analysisCount: 6  },
    { id: 6,  username: "한소희", email: "sohee.han@example.com",    status: "활성", joinDate: "2024-04-18", lastLogin: "2024-07-19", analysisCount: 19 },
    { id: 7,  username: "오준혁", email: "junhyuk.oh@example.com",   status: "활성", joinDate: "2024-05-02", lastLogin: "2024-07-21", analysisCount: 42 },
    { id: 8,  username: "윤아름", email: "areum.yoon@example.com",   status: "정지", joinDate: "2024-05-14", lastLogin: "2024-07-05", analysisCount: 3  },
    { id: 9,  username: "임채원", email: "chaewon.lim@example.com",  status: "활성", joinDate: "2024-05-27", lastLogin: "2024-07-20", analysisCount: 15 },
    { id: 10, username: "강태양", email: "taeyang.kang@example.com", status: "활성", joinDate: "2024-06-08", lastLogin: "2024-07-21", analysisCount: 7  },
    { id: 11, username: "백하은", email: "haeun.baek@example.com",   status: "활성", joinDate: "2024-06-15", lastLogin: "2024-07-18", analysisCount: 22 },
    { id: 12, username: "신동현", email: "donghyun.shin@example.com",status: "정지", joinDate: "2024-06-20", lastLogin: "2024-07-10", analysisCount: 9  },
    { id: 13, username: "조미래", email: "mirae.jo@example.com",     status: "활성", joinDate: "2024-06-25", lastLogin: "2024-07-21", analysisCount: 31 },
    { id: 14, username: "문지우", email: "jiwoo.moon@example.com",   status: "활성", joinDate: "2024-07-01", lastLogin: "2024-07-20", analysisCount: 5  },
    { id: 15, username: "류세진", email: "sejin.ryu@example.com",    status: "활성", joinDate: "2024-07-08", lastLogin: "2024-07-21", analysisCount: 2  },
  ];

  private static notices: MockNotice[] = [
    {
      notice_id: 1,
      title: "SkinAI 관리자 시스템 업데이트 안내",
      content: "SkinAI 관리자 시스템이 새롭게 업데이트되었습니다. 개선된 기능을 확인해보세요.",
      created_at: "2024-07-20",
      updated_at: "2024-07-20",
      is_active: true
    },
    {
      notice_id: 2,
      title: "정기 점검 안내",
      content: "시스템 안정화를 위한 정기 점검이 예정되어 있습니다. 이용에 참고해주시기 바랍니다.",
      created_at: "2024-07-18",
      updated_at: "2024-07-18",
      is_active: true
    },
    {
      notice_id: 3,
      title: "신규 기능 추가 안내",
      content: "AI 분석 기능이 개선되었습니다. 더 정확한 분석 결과를 확인할 수 있습니다.",
      created_at: "2024-07-15",
      updated_at: "2024-07-16",
      is_active: true
    },
  ];

  private static encyclopedia: MockEncyclopediaEntry[] = [
    {
      id: 1,
      title: "기저세포암",
      description: "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장합니다. 주로 얼굴, 목, 손 등 노출된 부위에 발생합니다.",
      modifiedDate: "2024-07-20",
    },
    {
      id: 2,
      title: "편평세포암",
      description: "두 번째로 흔한 피부암 유형입니다. 궤양 형태로 발생하며 전이 가능성이 있습니다.",
      modifiedDate: "2024-07-19",
    },
    {
      id: 3,
      title: "흑색종",
      description: "가장 위험한 피부암 유형으로, 빠르게 전이될 수 있습니다. 조기 발견이 매우 중요합니다.",
      modifiedDate: "2024-07-18",
    },
  ];

  private static records: MockExamRecord[] = [
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

  static getUsers(): MockUser[] {
    return this.users;
  }

  static getNotices(): MockNotice[] {
    return this.notices;
  }

  static getEncyclopedia(): MockEncyclopediaEntry[] {
    return this.encyclopedia;
  }

  static getRecords(): MockExamRecord[] {
    return this.records;
  }
}

// 검색 서비스 클래스
class SearchService {
  private useApi: boolean;

  constructor() {
    this.useApi = APP_CONFIG.USE_API;
  }

  // 사용자 검색
  async searchUsers(params: SearchParams): Promise<SearchResult<MockUser>> {
    if (this.useApi) {
      try {
        const response = await usersApi.getAll(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE,
          params.filters?.status || ''
        );
        
        // API 응답을 SearchResult 형식으로 변환
        return {
          data: response.data.data.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            status: user.status === 'ACTIVE' ? '활성' : user.status === 'SUSPENDED' ? '정지' : '삭제',
            joinDate: user.joinDate,
            lastLogin: user.lastLogin,
            analysisCount: user.analysisCount
          })),
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          pageSize: response.data.pagination.limit
        };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchUsersMock(params);
      }
    } else {
      return this.searchUsersMock(params);
    }
  }

  // 목업 사용자 검색
  private searchUsersMock(params: SearchParams): SearchResult<MockUser> {
    const users = MockDataProvider.getUsers();
    const query = params.query.toLowerCase();
    const statusFilter = params.filters?.status || 'all';

    const filtered = users.filter(user => {
      const matchesSearch = !query || 
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize
    };
  }

  // 공지사항 검색
  async searchNotices(params: SearchParams): Promise<SearchResult<MockNotice>> {
    if (this.useApi) {
      try {
        const response = await contentApi.notices.getAll(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE
        );
        
        return {
          data: response.data.data,
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          pageSize: response.data.pagination.limit
        };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchNoticesMock(params);
      }
    } else {
      return this.searchNoticesMock(params);
    }
  }

  // 목업 공지사항 검색
  private searchNoticesMock(params: SearchParams): SearchResult<MockNotice> {
    const notices = MockDataProvider.getNotices();
    const query = params.query.toLowerCase();

    const filtered = notices.filter(notice => {
      return !query || 
        notice.title.toLowerCase().includes(query) ||
        notice.content.toLowerCase().includes(query);
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize
    };
  }

  // 백과사전 검색
  async searchEncyclopedia(params: SearchParams): Promise<SearchResult<MockEncyclopediaEntry>> {
    if (this.useApi) {
      try {
        const response = await contentApi.diseases.getAll(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE
        );
        
        return {
          data: response.data.data.map(disease => ({
            id: disease.id,
            title: disease.title,
            description: disease.description,
            modifiedDate: disease.modifiedDate
          })),
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          pageSize: response.data.pagination.limit
        };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchEncyclopediaMock(params);
      }
    } else {
      return this.searchEncyclopediaMock(params);
    }
  }

  // 목업 백과사전 검색
  private searchEncyclopediaMock(params: SearchParams): SearchResult<MockEncyclopediaEntry> {
    const encyclopedia = MockDataProvider.getEncyclopedia();
    const query = params.query.toLowerCase();

    const filtered = encyclopedia.filter(entry => {
      return !query || 
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query);
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize
    };
  }

  // 검사기록 검색
  async searchRecords(params: SearchParams): Promise<SearchResult<MockExamRecord>> {
    if (this.useApi) {
      try {
        const response = await analysisApi.getExamRecords(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE,
          params.query
        );
        
        return {
          data: response.data.data.map(record => ({
            id: record.id,
            username: record.username,
            userId: record.userId,
            examDate: record.examDate,
            examType: record.examType,
            result: record.result,
            confidence: record.confidence,
            imageId: record.imageId
          })),
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          pageSize: response.data.pagination.limit
        };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchRecordsMock(params);
      }
    } else {
      return this.searchRecordsMock(params);
    }
  }

  // 목업 검사기록 검색
  private searchRecordsMock(params: SearchParams): SearchResult<MockExamRecord> {
    const records = MockDataProvider.getRecords();
    const query = params.query.toLowerCase();

    const filtered = records.filter(record => {
      return !query || 
        record.username.toLowerCase().includes(query) ||
        record.userId.toLowerCase().includes(query) ||
        record.result.toLowerCase().includes(query);
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize
    };
  }

  // API/목업 전환 메서드
  setUseApi(useApi: boolean): void {
    this.useApi = useApi;
  }

  // 현재 모드 확인
  isUsingApi(): boolean {
    return this.useApi;
  }
}

// 싱글톤 인스턴스
export const searchService = new SearchService();
