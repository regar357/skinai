# Admin API 모듈 문서

이 문서는 `api-spec.md`를 기반으로 생성된 Admin 브랜치 전용 API 모듈에 대한 상세 설명입니다.

## 📁 파일 구조

```
src/
├── api/
│   ├── index.ts          # API 모듈 통합
│   ├── auth.ts           # 인증 및 사용자 관리
│   ├── images.ts         # 이미지 관리
│   ├── analysis.ts       # AI 분석 결과 관리
│   ├── shares.ts         # 공유 링크 관리
│   ├── feedbacks.ts      # 피드백 관리
│   ├── content.ts        # 콘텐츠 관리 (백과, 공지, 병원)
│   ├── admin.ts          # Admin 전용 기능
│   └── README.md         # 이 문서
├── api-client.ts         # HTTP 클라이언트
└── types.ts              # TypeScript 타입 정의
```

## 🚀 사용 방법

### 1. 기본 설정

```typescript
import { authApi, analysisApi, adminApi } from '@/src/api';

// API 클라이언트는 자동으로 환경변수에서 BASE_URL을 가져옵니다
// NEXT_PUBLIC_API_BASE_URL이 없으면 기본값으로 http://localhost:8000/api 사용
```

### 2. 인증 관리

```typescript
// 로그인
const loginResponse = await authApi.login({
  email: 'admin@example.com',
  password: 'password123'
});

// 로그인 성공 시 토큰 저장
if (loginResponse.success) {
  localStorage.setItem('access_token', loginResponse.data.access_token);
  localStorage.setItem('refresh_token', loginResponse.data.refresh_token);
}

// 현재 사용자 정보 조회
const currentUser = await authApi.getCurrentUser();
```

### 3. Admin 대시보드 데이터 조회

```typescript
// 대시보드 통계
const dashboardStats = await adminApi.dashboard.getStats();

// 일별 활동 통계
const dailyActivity = await adminApi.dashboard.getDailyActivity(30);
```

### 4. 사용자 관리

```typescript
// 전체 사용자 목록 조회
const users = await adminApi.users.getAll(1, 20);

// 특정 상태의 사용자만 조회
const suspendedUsers = await adminApi.users.getAll(1, 20, 'SUSPENDED');

// 사용자 상태 변경
await adminApi.users.updateStatus(userId, 'SUSPENDED');
```

### 5. 분석 결과 관리

```typescript
// 전체 분석 결과 조회
const analyses = await adminApi.analyses.getAll(1, 20);

// 질환별 통계
const diseaseStats = await adminApi.analyses.getDiseaseStats();
```

## 🔧 API 모듈 상세 설명

### auth.ts
- **기능**: 회원가입, 로그인, 로그아웃, 사용자 정보 관리
- **주요 메소드**:
  - `signup()`: 회원가입
  - `login()`: 로그인
  - `logout()`: 로그아웃
  - `getCurrentUser()`: 현재 사용자 정보
  - `deleteUser()`: 회원 탈퇴

### images.ts
- **기능**: 이미지 업로드, 조회, 삭제
- **주요 메소드**:
  - `upload()`: 이미지 업로드 (S3)
  - `getImage()`: 이미지 정보 조회
  - `getUserImages()`: 사용자별 이미지 목록
  - `deleteImage()`: 이미지 삭제

### analysis.ts
- **기능**: AI 분석 결과 관리 및 통계
- **주요 메소드**:
  - `create()`: AI 분석 요청
  - `getAll()`: 분석 결과 목록
  - `getById()`: 분석 결과 상세
  - `getStats()`: 분석 통계
  - `getDailyStats()`: 일별 통계

### shares.ts
- **기능**: 공유 링크 관리
- **주요 메소드**:
  - `create()`: 공유 링크 생성
  - `getByToken()`: 토큰으로 공유 정보 조회
  - `getUserShares()`: 사용자별 공유 링크
  - `getStats()`: 공유 통계

### feedbacks.ts
- **기능**: 피드백 관리
- **주요 메소드**:
  - `create()`: 피드백 작성
  - `getAll()`: 피드백 목록
  - `getByAnalysis()`: 분석 결과별 피드백
  - `getStats()`: 피드백 통계

### content.ts
- **기능**: 콘텐츠 관리 (백과사전, 공지사항, 병원 정보)
- **주요 메소드**:
  - `diseases.*`: 피부 백과사전 관리
  - `notices.*`: 공지사항 관리
  - `hospitals.*`: 병원 정보 관리

### admin.ts ⭐ (Admin 전용)
- **기능**: 관리자 전용 기능
- **주요 메소드**:
  - `users.*`: 사용자 관리 (상태 변경, 통계)
  - `analyses.*`: 분석 결과 관리 (삭제, 통계)
  - `feedbacks.*`: 피드백 관리
  - `dashboard.*`: 대시보드 데이터
  - `system.*`: 시스템 관리 (상태, 로그, 백업)

## 🛡️ 에러 처리

```typescript
try {
  const result = await adminApi.users.getAll();
  if (result.success) {
    console.log('Users:', result.data);
  } else {
    console.error('API Error:', result.error);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

## 🔐 인증

API 클라이언트는 자동으로 `localStorage`에 저장된 `access_token`을 사용하여 인증을 처리합니다.

```typescript
// 토큰 저장 (로그인 후)
localStorage.setItem('access_token', token);

// 토큰 삭제 (로그아웃 시)
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

## 📊 응답 형식

모든 API 응답은 `ApiResponse<T>` 형식을 따릅니다:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 응답
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

## 🌍 환경 설정

`.env.local` 파일에 다음 환경변수를 추가하세요:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 📝 주의사항

1. **Admin 전용 기능**: `admin.ts`에 정의된 기능들은 관리자 권한이 필요합니다
2. **토큰 관리**: 로그인 후 받은 토큰을 `localStorage`에 저장해야 합니다
3. **에러 처리**: 모든 API 호출은 try-catch로 감싸서 에러를 처리해야 합니다
4. **타입 안전성**: TypeScript 타입이 모두 정의되어 있어 타입 안전성이 보장됩니다

## 🔄 API 명세서와의 매핑

이 API 모듈은 `api-spec.md`에 정의된 모든 엔드포인트를 구현하며, Admin 브랜치에 필요한 추가 기능들을 포함하고 있습니다:

- ✅ 인증 및 사용자 관리 (`/api/auth/*`, `/api/users/*`)
- ✅ 이미지 관리 (`/api/images/*`)
- ✅ AI 분석 (`/api/analysis/*`)
- ✅ 공유 및 피드백 (`/api/shares/*`, `/api/feedbacks/*`)
- ✅ 콘텐츠 관리 (`/api/diseases/*`, `/api/notices/*`, `/api/hospitals/*`)
- ➕ Admin 전용 기능 (`/api/admin/*`)
