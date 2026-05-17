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
  ];

  static getUsers(): MockUser[] { return this.users; }
  static getNotices(): MockNotice[] { return this.notices; }
  static getEncyclopedia(): MockEncyclopediaEntry[] { return this.encyclopedia; }
  static getRecords(): MockExamRecord[] { return this.records; }
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
        const statusMap: Record<string, string> = { '활성': 'active', '정지': 'suspended' };
        const apiStatus = statusMap[params.filters?.status || ''] || '';
        const res = await usersApi.getAll(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE,
          apiStatus
        ) as any;

        const items = (res.data?.data || res.data || []).map((u: any) => ({
          id: u.user_id,
          username: u.name,
          email: u.email,
          status: u.status === 'active' ? '활성' : u.status === 'suspended' ? '정지' : '삭제' as any,
          joinDate: u.created_at || '',
          lastLogin: u.last_login_at || '',
          analysisCount: 0,
        }));
        const pg = res.data?.pagination || res.pagination || {};
        return { data: items, total: pg.total || 0, page: pg.page || 1, pageSize: pg.limit || 10 };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchUsersMock(params);
      }
    }
    return this.searchUsersMock(params);
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
    return { data: filtered.slice(startIndex, startIndex + pageSize), total: filtered.length, page, pageSize };
  }

  // 공지사항 검색
  async searchNotices(params: SearchParams): Promise<SearchResult<MockNotice>> {
    if (this.useApi) {
      try {
        const res = await contentApi.notices.getAll(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE
        ) as any;

        const items = (res.data || []).map((n: any) => ({
          notice_id: n.notice_id || n.id,
          title: n.title,
          content: n.content,
          created_at: n.created_at || n.createdAt || '',
          updated_at: n.updated_at || '',
          is_active: n.is_active !== false,
        }));
        const pg = res.pagination || {};
        return { data: items, total: pg.total || res.total || items.length, page: pg.page || 1, pageSize: pg.limit || 10 };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchNoticesMock(params);
      }
    }
    return this.searchNoticesMock(params);
  }

  // 목업 공지사항 검색
  private searchNoticesMock(params: SearchParams): SearchResult<MockNotice> {
    const notices = MockDataProvider.getNotices();
    const query = params.query.toLowerCase();
    const filtered = notices.filter(n => !query || n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    return { data: filtered.slice(startIndex, startIndex + pageSize), total: filtered.length, page, pageSize };
  }

  // 백과사전 검색
  async searchEncyclopedia(params: SearchParams): Promise<SearchResult<MockEncyclopediaEntry>> {
    if (this.useApi) {
      try {
        const res = await contentApi.diseases.getAll(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE
        ) as any;

        const items = (res.data || []).map((a: any) => ({
          id: a.article_id || a.id,
          title: a.title,
          description: a.content || a.description || '',
          modifiedDate: a.updated_at || a.created_at || '',
        }));
        const pg = res.pagination || {};
        return { data: items, total: pg.total || res.total || items.length, page: pg.page || 1, pageSize: pg.limit || 10 };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchEncyclopediaMock(params);
      }
    }
    return this.searchEncyclopediaMock(params);
  }

  // 목업 백과사전 검색
  private searchEncyclopediaMock(params: SearchParams): SearchResult<MockEncyclopediaEntry> {
    const encyclopedia = MockDataProvider.getEncyclopedia();
    const query = params.query.toLowerCase();
    const filtered = encyclopedia.filter(e => !query || e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query));
    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    return { data: filtered.slice(startIndex, startIndex + pageSize), total: filtered.length, page, pageSize };
  }

  // 검사기록 검색
  async searchRecords(params: SearchParams): Promise<SearchResult<MockExamRecord>> {
    if (this.useApi) {
      try {
        const res = await analysisApi.getExamRecords(
          params.page || 1,
          params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE,
          params.query
        ) as any;

        const items = (res.data?.data || res.data || []).map((r: any) => ({
          id: r.diagnosis_id || r.id,
          username: r.user_name || `User #${r.user_id}`,
          userId: String(r.user_id || ''),
          examDate: r.created_at || '',
          examType: r.diagnosis_type || '',
          result: r.result_summary || r.status || '',
          confidence: Number(r.ai_confidence) || 0,
          imageId: String(r.diagnosis_id || r.id || ''),
        }));
        const pg = res.data?.pagination || res.pagination || {};
        return { data: items, total: pg.total || 0, page: pg.page || 1, pageSize: pg.limit || 10 };
      } catch (error) {
        console.warn('API 연동 실패, 목업 데이터로 전환:', error);
        return this.searchRecordsMock(params);
      }
    }
    return this.searchRecordsMock(params);
  }

  // 목업 검사기록 검색
  private searchRecordsMock(params: SearchParams): SearchResult<MockExamRecord> {
    const records = MockDataProvider.getRecords();
    const query = params.query.toLowerCase();
    const filtered = records.filter(r => !query || r.username.toLowerCase().includes(query) || r.userId.toLowerCase().includes(query) || r.result.toLowerCase().includes(query));
    const page = params.page || 1;
    const pageSize = params.pageSize || APP_CONFIG.SEARCH.PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    return { data: filtered.slice(startIndex, startIndex + pageSize), total: filtered.length, page, pageSize };
  }

  setUseApi(useApi: boolean): void { this.useApi = useApi; }
  isUsingApi(): boolean { return this.useApi; }
}

// 싱글톤 인스턴스
export const searchService = new SearchService();
