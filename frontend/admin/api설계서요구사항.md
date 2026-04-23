

# 📋 피부 상태 검사 서비스 API 명세서 (v0.2)

## 1. 서비스 개요
* [cite_start]**프로젝트명:** AI를 활용한 피부종양 및 안면부 상태 검사 서비스 [cite: 2]
* [cite_start]**기술 스택:** FastAPI (AI 서버), YOLOv8 (추론), Amazon S3 (이미지 저장), MySQL (RDS) [cite: 5, 6, 7]
* [cite_start]**Base URL:** `/api` [cite: 19]

---

## 2. 도메인별 API 상세

### 🔐 2.1. 인증 및 사용자 (Auth Users)
| Method | URI | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | [cite_start]회원 가입 [cite: 19] |
| **POST** | `/api/auth/login` | [cite_start]로그인 [cite: 19] |
| **POST** | `/api/auth/logout` | [cite_start]로그아웃 [cite: 19] |
| **DELETE** | `/api/users/{user_id}` | [cite_start]회원 탈퇴 [cite: 21] |

### 🖼️ 2.2. 이미지 관리 (Images)
| Method | URI | Description |
| :--- | :--- | :--- |
| **POST** | `/api/images` | [cite_start]이미지 업로드 (S3 저장) [cite: 8, 39] |

### 🧠 2.3. AI 분석 (Analysis)
| Method | URI | Description |
| :--- | :--- | :--- |
| **POST** | `/api/analysis` | [cite_start]AI 분석 요청 [cite: 40] |
| **GET** | `/api/analysis` | [cite_start]분석 결과 목록 조회 [cite: 38] |
| **GET** | `/api/analysis/{analysis_id}` | [cite_start]분석 결과 상세 조회 [cite: 38] |
| **DELETE** | `/api/analysis/{analysis_id}` | [cite_start]분석 결과 삭제 [cite: 44] |

### 🔗 2.4. 결과 공유 및 피드백 (Shares & Feedbacks)
| Method | URI | Description |
| :--- | :--- | :--- |
| **POST** | `/api/analysis/{analysis_id}/share` | [cite_start]공유 링크 생성 [cite: 62] |
| **GET** | `/api/feedbacks` | [cite_start]피드백 조회 [cite: 61] |
| **POST** | `/api/feedbacks` | [cite_start]사용자 피드백 작성 [cite: 63] |

### 📚 2.5. 콘텐츠 및 기타 (Encyclopedia, Notices, Hospitals)
| Method | URI | Description |
| :--- | :--- | :--- |
| **GET** | `/api/diseases` | [cite_start]피부 백과 목록 조회 [cite: 84] |
| **GET** | `/api/diseases/{disease_id}` | [cite_start]백과 상세 조회 [cite: 84] |
| **GET** | `/api/notices` | [cite_start]공지사항 목록 조회 [cite: 108] |
| **GET** | `/api/notices/{notice_id}` | [cite_start]공지사항 상세 조회 [cite: 108] |
| **GET** | `/api/hospitals` | [cite_start]주변 병원 찾기 [cite: 110] |

---

## 3. 데이터 모델 (DB Schema)
프론트엔드에서 인터페이스 정의 시 참고하세요.

### [cite_start]**User (사용자)** [cite: 178]
```typescript
interface User {
  user_id: number;     // PK
  email: string;
  nickname: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  created_at: string;
}
```

### [cite_start]**AI Analysis Result (분석 결과)** [cite: 260]
```typescript
interface AIAnalysisResult {
  analysis_id: number; // PK
  image_id: number;    // FK
  user_id: number;     // FK
  result_status: 'NORMAL' | 'ABNORMAL';
  suspected_disease: string; // 의심 질환명
  confidence_score: number;  // AI 신뢰도 (float)
  guide_text: string;        // 사용자 가이드
  created_at: string;
}
```

--