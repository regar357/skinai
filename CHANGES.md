# API 경로 정합 작업 요약

프론트엔드 양식 문서 (`mobileweb/API-양식-문서.md`, `admin/관리자웹 API-문서.md`) 기준으로
백엔드 모든 서비스의 라우트와 응답 구조를 맞췄습니다.

## 핵심 변경사항

### auth-service
- `/auth/register` → **`/auth/signup`** (라우트, 컨트롤러, 서비스 메서드 전부 변경)
- 응답을 `{ token, data }` → **`{ accessToken, refreshToken, user: { id, name, email } }`** 양식으로 변경
- `_issueTokens()` 헬퍼 추가 — accessToken + refreshToken 동시 발급

### user-service
- `GET /users/me` (내 프로필 조회) **신규 추가** — 양식 문서 정합
- `DELETE /users/me`의 검증 방식: 기존 `password` → **`confirmText`** ("회원탈퇴" 문구 일치)
- `findById`에서 name, email 컬럼 명시 조회

### diagnosis-service
- `GET /diagnoses/me` → **`GET /diagnoses/history`**
- **`DELETE /diagnoses/:id`** (단건 삭제) 신규 추가
- **`DELETE /diagnoses`** body `{ ids: [] }` (다건 삭제) 신규 추가
- `size` 쿼리 파라미터 지원 (프론트는 `size`, 백엔드는 `limit` 둘 다 호환)

### feedback-service
- 마운팅 prefix `/api/v1/feedbacks` → **`/api/v1/feedback`** (단수형, 양식 정합)
- `GET /feedback/me` → **`GET /feedback/my`**
- `DELETE /feedback/:feedback_id` → **`DELETE /feedback/my/:id`**

### hospital-service
- `GET /hospitals/search` → **`GET /hospitals/nearby`**
- 쿼리 양식: `lat, lng, sort(distance|rating), page, size` 지원
- 페이지네이션 응답 추가

### content-service
- `/api/v1/content/notices`, `/api/v1/content/encyclopedia` 외에
  **`/api/v1/notices`**, **`/api/v1/encyclopedia`** prefix로도 직접 노출 (양식 정합)
- `contentRoutes.js`를 `createNoticeRoutes`, `createEncyclopediaRoutes` 분리 export

### admin-service (대폭 보강)
양식 문서의 27개 admin 엔드포인트 전부 구현:

**인증**
- `POST /admin/login` (auth-service 위임 + role 검증)

**사용자 관리**
- `GET /admin/users`
- `PATCH /admin/users/:userId/suspend`, `/unsuspend`
- `DELETE /admin/users/:userId`

**피드백 관리**
- `GET /admin/feedbacks`
- `POST /admin/feedbacks/:feedbackId/reply`

**분석/이미지**
- `GET /admin/analyses/records`
- `GET /admin/analyses/images/:imageId`

**질환(피부백과) 관리** (content-service 위임)
- `GET /admin/diseases/:diseaseId`
- `POST/PUT/DELETE /admin/diseases[/:diseaseId]`

**대시보드**
- `GET /admin/dashboard/stats`, `/diagnosis-trend`, `/disease-distribution`, `/user-trend`

**AI 모니터링**
- `GET /admin/monitoring/performance`, `/disease-accuracy`, `/system-status`, `/model-info`

**공지사항 관리** (content-service 위임)
- `GET/POST /admin/notices`
- `PUT/DELETE /admin/notices/:noticeId`

추가/재생성 파일:
- `interfaces/AdminController.js` — 모든 핸들러
- `application/AdminService.js` — 비즈니스 로직 (auth/content 서비스 호출, 로컬 통계)
- `infrastructure/clients/ServiceClient.js` — 서비스 간 호출 클라이언트
- `infrastructure/db/AdminRepositoryImpl.js` — 통계 + safe() fallback 패턴
- `domain/interfaces/AdminRepository.js` — 인터페이스 재정의
- `server.js` — 새 의존성 조립 (jwt, repository, serviceClient)

### api-gateway
- `/api/v1/auth/register` → **`/api/v1/auth/signup`** 공개 라우팅
- **`/api/v1/notices`**, **`/api/v1/encyclopedia`** 신규 라우팅 (content-service로 프록시, GET 공개/쓰기 관리자)
- `/api/v1/feedbacks` → **`/api/v1/feedback`** (단수형)
- **`/api/v1/admin/login`**만 공개, 나머지 `/admin/*`은 관리자 전용

### admin frontend
- `src/api-client.ts` baseURL `/api` → **`/api/v1`** (양식 문서 정합)

## 응답 구조 정합

로그인/회원가입 응답:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": 1, "name": "홍길동", "email": "user@example.com" }
}
```

## 호환성 노트

- `/api/v1/content/*` 호환 라우팅 유지 — 기존 코드가 있어도 깨지지 않음
- diagnosis/feedback 컨트롤러의 기존 메서드 시그니처 유지하며 신규 메서드 추가
- repository 통계 쿼리 실패 시 빈 배열/0 반환 (`safe()` 패턴)

## 알려진 제약

- monitoring 통계(`getPerformanceMetrics`, `getDiseaseAccuracy`, `getSystemStatus`, `getModelInfo`)는
  실 데이터 수집 파이프라인이 없어 stub 반환. 환경변수 `AI_MODEL_*`로 모델 정보만 노출 가능.
- `admin-service` 의 통계 쿼리는 `users`, `diagnoses`, `feedbacks`, `images` 테이블이 같은 DB에
  있다고 가정. MSA 분리 운영 시에는 read-replica 또는 내부 API 패턴으로 전환 필요.
