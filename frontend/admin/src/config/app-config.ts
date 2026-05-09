export const APP_CONFIG = {
  // API 연동 여부 설정 (true: API 사용, false: 목업 데이터 사용)
  USE_API: process.env.NODE_ENV === 'production' || false,
  
  // 검색 관련 설정
  SEARCH: {
    // 디바운스 시간 (ms)
    DEBOUNCE_TIME: 300,
    // 최소 검색 길이
    MIN_SEARCH_LENGTH: 1,
    // 한 페이지당 결과 수
    PAGE_SIZE: 10,
  },
  
  // API 엔드포인트
  API_ENDPOINTS: {
    USERS: '/admin/users',
    NOTICES: '/admin/notices',
    DISEASES: '/admin/diseases',
    RECORDS: '/admin/analyses/records',
  }
} as const;
