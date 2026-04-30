# 📋 Admin 프로젝트 API 총정리 문서

## 🎯 개요

이 문서는 SkinAI Admin 프로젝트에 설정된 모든 API를 한글로 정리한 종합 문서입니다. `api설계서요구사항.md`를 기반으로 구현된 API 모듈들의 상세 설명과 사용법을 포함하고 있습니다.

---

## 📁 프로젝트 구조

```
frontend/admin/
├── src/
│   ├── api/
│   │   ├── index.ts          # API 모듈 통합
│   │   ├── auth.ts           # 인증 및 사용자 관리
│   │   ├── images.ts         # 이미지 관리
│   │   ├── analysis.ts       # AI 분석 결과 관리
│   │   ├── shares.ts         # 공유 링크 관리
│   │   ├── feedbacks.ts      # 피드백 관리
│   │   ├── content.ts        # 콘텐츠 관리
│   │   └── admin.ts          # Admin 전용 기능
│   ├── api-client.ts         # HTTP 클라이언트
│   └── types.ts              # TypeScript 타입 정의
└── api-spec.md               # API 명세서
```

---

## 🔐 1. 인증 및 사용자 관리 (auth.ts)

### 기능 설명
사용자의 회원가입, 로그인, 로그아웃 및 계정 관리 기능을 제공합니다.

### 주요 API 목록

| 메소드 | 기능 | 설명 |
|--------|------|------|
| `signup(data)` | 회원가입 | 새로운 사용자 계정 생성 |
| `login(data)` | 일반 사용자 로그인 | 이메일/비밀번호로 인증 |
| `adminLogin(data)` | 관리자 로그인 | 관리자 전용 로그인 (/api/admin/login) |
| `logout()` | 로그아웃 | 현재 세션 종료 |
| `getCurrentUser()` | 사용자 정보 조회 | 현재 로그인된 사용자 정보 |
| `deleteUser(userId)` | 회원 탈퇴 | 특정 사용자 계정 삭제 |

### 사용 예시
```typescript
import { authApi } from '@/src/api';

// 일반 사용자 로그인
const loginResult = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// 관리자 로그인
const adminLoginResult = await authApi.adminLogin({
  email: 'admin@example.com',
  password: 'admin123'
});

// 현재 사용자 정보
const userInfo = await authApi.getCurrentUser();
```

---

## 🖼️ 2. 이미지 관리 (images.ts)

### 기능 설명
피부 이미지의 업로드, 조회, 삭제 및 S3 저장소 연동 기능을 제공합니다.

### 주요 API 목록

| 메소드 | 기능 | 설명 |
|--------|------|------|
| `upload(file)` | 이미지 업로드 | 파일을 S3에 업로드 |
| `getImage(imageId)` | 이미지 정보 조회 | 특정 이미지 상세 정보 |
| `getUserImages(userId)` | 사용자 이미지 목록 | 특정 사용자의 모든 이미지 |
| `deleteImage(imageId)` | 이미지 삭제 | 특정 이미지 삭제 |

### 사용 예시
```typescript
import { imagesApi } from '@/src/api';

// 이미지 업로드
const fileInput = document.getElementById('file') as HTMLInputElement;
const file = fileInput.files[0];
const uploadResult = await imagesApi.upload(file);

// 사용자 이미지 목록
const userImages = await imagesApi.getUserImages(userId);
```

---

## 🧠 3. AI 분석 결과 관리 (analysis.ts)

### 기능 설명
AI 피부 분석 결과의 생성, 조회, 삭제 및 통계 분석 기능을 제공합니다.

### 주요 API 목록

| 메소드 | 기능 | 설명 |
|--------|------|------|
| `create(data)` | 분석 요청 | AI 분석 실행 요청 |
| `getAll(page, limit)` | 분석 결과 목록 | 전체 분석 결과 목록 |
| `getUserAnalysis(userId)` | 사용자 분석 결과 | 특정 사용자의 분석 결과 |
| `getById(analysisId)` | 분석 결과 상세 | 특정 분석 결과 상세 정보 |
| `delete(analysisId)` | 분석 결과 삭제 | 특정 분석 결과 삭제 |
| `getStats()` | 분석 통계 | 전체 분석 통계 정보 |
| `getDailyStats(days)` | 일별 통계 | 기간별 일별 분석 통계 |

### 사용 예시
```typescript
import { analysisApi } from '@/src/api';

// AI 분석 요청
const analysisResult = await analysisApi.create({
  image_id: 123
});

// 분석 통계
const stats = await analysisApi.getStats();
const dailyStats = await analysisApi.getDailyStats(30);
```

---

## 🔗 4. 공유 링크 관리 (shares.ts)

### 기능 설명
분석 결과 공유 링크의 생성, 조회, 삭제 및 통계 기능을 제공합니다.

### 주요 API 목록

| 메소드 | 기능 | 설명 |
|--------|------|------|
| `create(data)` | 공유 링크 생성 | 분석 결과 공유 링크 생성 |
| `getByToken(token)` | 공유 정보 조회 | 토큰으로 공유 정보 조회 |
| `getUserShares(userId)` | 사용자 공유 목록 | 특정 사용자의 공유 링크 |
| `delete(shareId)` | 공유 링크 삭제 | 특정 공유 링크 삭제 |
| `getStats()` | 공유 통계 | 공유 링크 통계 정보 |

### 사용 예시
```typescript
import { sharesApi } from '@/src/api';

// 공유 링크 생성
const shareResult = await sharesApi.create({
  analysis_id: 456
});

// 공유 통계
const shareStats = await sharesApi.getStats();
```

---

## 💬 5. 피드백 관리 (feedbacks.ts)

### 기능 설명
사용자 피드백의 작성, 조회, 삭제 및 평가 통계 기능을 제공합니다.

### 주요 API 목록

| 메소드 | 기능 | 설명 |
|--------|------|------|
| `create(data)` | 피드백 작성 | 새로운 피드백 등록 |
| `getAll(page, limit)` | 피드백 목록 | 전체 피드백 목록 |
| `getByAnalysis(analysisId)` | 분석별 피드백 | 특정 분석 결과의 피드백 |
| `getUserFeedbacks(userId)` | 사용자 피드백 | 특정 사용자의 피드백 |
| `delete(feedbackId)` | 피드백 삭제 | 특정 피드백 삭제 |
| `getStats()` | 피드백 통계 | 피드백 평가 통계 |

### 사용 예시
```typescript
import { feedbacksApi } from '@/src/api';

// 피드백 작성
const feedbackResult = await feedbacksApi.create({
  analysis_id: 789,
  content: "매우 만족스러운 결과입니다.",
  rating: 5
});

// 피드백 통계
const feedbackStats = await feedbacksApi.getStats();
```

---

## 📚 6. 콘텐츠 관리 (content.ts)

### 기능 설명
피부 백과사전, 공지사항, 병원 정보 등 콘텐츠 관리 기능을 제공합니다.

### 주요 API 목록

#### 피부 백과사전 (diseases)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getAll()` | 백과 목록 | 전체 피부 질환 목록 |
| `getById(diseaseId)` | 백과 상세 | 특정 질환 상세 정보 |
| `create(data)` | 백과 생성 | 새로운 질환 정보 등록 (/admin/diseases) |
| `update(diseaseId, data)` | 백과 수정 | 질환 정보 수정 (/admin/diseases/{id}) |
| `delete(diseaseId)` | 백과 삭제 | 질환 정보 삭제 (/admin/diseases/{id}) |

#### 공지사항 (notices)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getAll()` | 공지사항 목록 | 전체 공지사항 목록 |
| `getById(noticeId)` | 공지사항 상세 | 특정 공지사항 상세 |
| `create(data)` | 공지사항 생성 | 새로운 공지사항 등록 (/admin/notices) |
| `update(noticeId, data)` | 공지사항 수정 | 공지사항 내용 수정 (/admin/notices/{id}) |
| `delete(noticeId)` | 공지사항 삭제 | 공지사항 삭제 (/admin/notices/{id}) |
| `getActive()` | 활성 공지사항 | 현재 활성화된 공지사항 |

#### 병원 정보 (hospitals)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `search(params)` | 병원 검색 | 위치/진료과별 병원 검색 |
| `getById(hospitalId)` | 병원 상세 | 특정 병원 상세 정보 |
| `create(data)` | 병원 등록 | 새로운 병원 정보 등록 |
| `update(hospitalId, data)` | 병원 수정 | 병원 정보 수정 |
| `delete(hospitalId)` | 병원 삭제 | 병원 정보 삭제 |

### 사용 예시
```typescript
import { contentApi } from '@/src/api';

// 피부 백과사전 목록
const diseases = await contentApi.diseases.getAll();

// 주변 병원 검색
const hospitals = await contentApi.hospitals.search({
  latitude: 37.5665,
  longitude: 126.9780,
  radius: 5,
  department: '피부과'
});

// 활성 공지사항
const activeNotices = await contentApi.notices.getActive();
```

---

## 🛡️ 7. Admin 전용 기능 (admin.ts)

### 기능 설명
관리자 전용의 사용자 관리, 시스템 통계, 대시보드 기능을 제공합니다.

### 주요 API 목록

#### 사용자 관리 (users)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getAll(page, limit, status)` | 사용자 목록 | 전체 사용자 목록 (상태 필터) |
| `getById(userId)` | 사용자 상세 | 특정 사용자 상세 정보 |
| `suspend(userId)` | 사용자 정지 | 사용자 계정 정지 (PATCH) |
| `unsuspend(userId)` | 정지 해제 | 사용자 계정 정지 해제 (PATCH) |
| `getStats()` | 사용자 통계 | 사용자 관련 통계 정보 |

#### 분석 결과 관리 (analyses)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getAll(page, limit, status)` | 분석 결과 목록 | 전체 분석 결과 목록 |
| `getUserAnalyses(userId)` | 사용자 분석 결과 | 특정 사용자의 분석 결과 |
| `delete(analysisId)` | 분석 결과 삭제 | 분석 결과 강제 삭제 |
| `getStats()` | 분석 통계 | 분석 관련 통계 |
| `getDiseaseStats()` | 질환별 통계 | 질환별 분석 통계 |

#### 피드백 관리 (feedbacks)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getAll(page, limit, rating)` | 피드백 목록 | 전체 피드백 목록 |
| `delete(feedbackId)` | 피드백 삭제 | 피드백 강제 삭제 |
| `getStats()` | 피드백 통계 | 피드백 관련 통계 |
| `reply(feedbackId, replyText)` | 관리자 답변 | 관리자 피드백 답변 작성 (POST /api/admin/feedbacks/{id}/reply) |

#### 대시보드 (dashboard)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getStats()` | 대시보드 통계 | 종합 대시보드 통계 |
| `getDailyActivity(days)` | 일별 활동 | 기간별 일별 활동 통계 |

#### 시스템 관리 (system)
| 메소드 | 기능 | 설명 |
|--------|------|------|
| `getStatus()` | 시스템 상태 | 시스템 상태 확인 |
| `getLogs(level, page, limit)` | 시스템 로그 | 시스템 로그 조회 |
| `createBackup()` | 백업 생성 | 시스템 백업 생성 |

### 사용 예시
```typescript
import { adminApi } from '@/src/api';

// 대시보드 통계
const dashboardStats = await adminApi.dashboard.getStats();

// 사용자 정지 (PATCH 메소드)
await adminApi.users.suspend(userId);

// 사용자 정지 해제 (PATCH 메소드)
await adminApi.users.unsuspend(userId);

// 관리자 피드백 답변
const replyResult = await adminApi.feedbacks.reply(789, "소중한 피드백 감사드립니다.");

// 시스템 상태 확인
const systemStatus = await adminApi.system.getStatus();

// 일별 활동 통계
const dailyActivity = await adminApi.dashboard.getDailyActivity(30);
```

---

## 🛠️ 8. API 클라이언트 설정 (api-client.ts)

### 기능 설명
HTTP 요청을 처리하는 기본 클라이언트로, 인증, 에러 처리, 파일 업로드 기능을 제공합니다.

### 주요 기능
- 자동 토큰 인증 처리
- 통일된 에러 처리
- 파일 업로드 지원
- 환경변수 기반 URL 설정

### 환경 설정
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 사용 예시
```typescript
import { apiClient } from '@/src/api-client';

// 직접 API 호출
const result = await apiClient.get('/users');
const postResult = await apiClient.post('/analysis', { image_id: 123 });
```

---

## 📊 9. 데이터 타입 정의 (types.ts)

### 기능 설명
모든 API 요청/응답에 대한 TypeScript 타입을 정의하여 타입 안전성을 보장합니다.

### 주요 타입
- `UserStatus`: 사용자 상태 ('ACTIVE' | 'SUSPENDED' | 'DELETED')
- `User`: 사용자 정보
- `AIAnalysisResult`: AI 분석 결과
- `Image`: 이미지 정보
- `Share`: 공유 링크 정보
- `Feedback`: 피드백 정보
- `Disease`: 질환 정보
- `Notice`: 공지사항 정보
- `Hospital`: 병원 정보
- `ApiResponse<T>`: API 응답 형식
- `PaginatedResponse<T>`: 페이지네이션 응답 형식

---

## 🚀 10. 전체 사용 가이드

### 기본 설정
```typescript
// 1. API 모듈 임포트
import { authApi, adminApi, analysisApi } from '@/src/api';

// 2. 관리자 로그인
const loginResult = await authApi.adminLogin({
  email: 'admin@example.com',
  password: 'admin123'
});

// 3. 토큰 저장
if (loginResult.success) {
  localStorage.setItem('access_token', loginResult.data.access_token);
}
```

### 에러 처리
```typescript
try {
  const result = await adminApi.users.getAll();
  if (result.success) {
    console.log('사용자 목록:', result.data);
  } else {
    console.error('API 오류:', result.error);
  }
} catch (error) {
  console.error('네트워크 오류:', error);
}
```

### 페이지네이션
```typescript
// 1페이지, 20개씩 조회
const users = await adminApi.users.getAll(1, 20);
if (users.success) {
  console.log('전체 사용자 수:', users.data.pagination.total);
  console.log('현재 페이지 사용자:', users.data.data);
}
```

---

## 📋 11. API 요약 표

| 카테고리 | 모듈 | 주요 기능 | Admin 전용 |
|----------|------|-----------|------------|
| 인증 | auth.ts | 로그인, 회원가입, 사용자 정보 | ❌ |
| 이미지 | images.ts | 업로드, 조회, 삭제 | ❌ |
| AI 분석 | analysis.ts | 분석 요청, 결과 조회, 통계 | ❌ |
| 공유 | shares.ts | 링크 생성, 공유 관리 | ❌ |
| 피드백 | feedbacks.ts | 피드백 작성, 조회, 평가 | ❌ |
| 콘텐츠 | content.ts | 백과, 공지, 병원 정보 | ❌ |
| 관리자 | admin.ts | 사용자 관리, 통계, 시스템 | ✅ |

---

## 🔍 12. 주의사항

1. **인증**: 대부분의 API는 로그인 후 토큰이 필요합니다
2. **Admin 권한**: `admin.ts`의 기능들은 관리자 권한이 필요합니다
3. **에러 처리**: 모든 API 호출은 try-catch로 감싸야 합니다
4. **타입 안전**: TypeScript 타입이 모두 정의되어 있어 안전합니다
5. **환경변수**: `NEXT_PUBLIC_API_BASE_URL` 설정이 필요합니다

---

## 📞 13. 문의 및 지원

이 API 문서와 관련된 문의사항이나 개선 제안이 있으시면 개발팀에 문의해 주세요.

- **API 명세서**: `api설계서요구사항.md`
- **타입 정의**: `src/types.ts`
- **API 클라이언트**: `src/api-client.ts`
- **사용 예시**: 각 모듈 파일 내 주석 참조

---

*이 문서는 SkinAI Admin 프로젝트의 API 사용을 돕기 위해 작성되었습니다.*
