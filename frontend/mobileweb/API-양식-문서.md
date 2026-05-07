# SkinAI API 문서 (양식)

---

## 1. 인증 API (Auth)

### 로그인 API

## API 개요

### 기본 정보
- **API 이름**: Login
- **엔드포인트**: `/auth/login`
- **메서드**: POST
- **설명**: 사용자 로그인 처리

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| email | IN | String | Yes | 사용자 이메일 주소 |
| password | IN | String | Yes | 사용자 비밀번호 |
| accessToken | OUT | String | - | JWT 접근 토큰 |
| refreshToken | OUT | String | - | JWT 리프레시 토큰 |
| user.id | OUT | Integer | - | 사용자 고유 ID |
| user.name | OUT | String | - | 사용자 이름 |
| user.email | OUT | String | - | 사용자 이메일 주소 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/v1/auth/login",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "홍길동",
      "email": "user@example.com"
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "user@example.com"
  }
}
```

---

### 회원가입 API

## API 개요

### 기본 정보
- **API 이름**: Signup
- **엔드포인트**: `/auth/signup`
- **메서드**: POST
- **설명**: 신규 사용자 회원가입

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| name | IN | String | Yes | 사용자 이름 |
| email | IN | String | Yes | 사용자 이메일 주소 |
| password | IN | String | Yes | 사용자 비밀번호 |
| accessToken | OUT | String | - | JWT 접근 토큰 |
| refreshToken | OUT | String | - | JWT 리프레시 토큰 |
| user.id | OUT | Integer | - | 사용자 고유 ID |
| user.name | OUT | String | - | 사용자 이름 |
| user.email | OUT | String | - | 사용자 이메일 주소 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/v1/auth/signup",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "name": "홍길동",
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "홍길동",
      "email": "user@example.com"
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "user@example.com"
  }
}
```

---

## 2. 진단 API (Diagnosis)

### 이미지 분석 API

## API 개요

### 기본 정보
- **API 이름**: Analyze Image
- **엔드포인트**: `/diagnoses`
- **메서드**: POST
- **설명**: 피부 이미지 분석 요청

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| image | IN | File | Yes | 분석할 피부 이미지 파일 |
| diagnosisId | OUT | Integer | - | 진단 고유 ID |
| imageUrl | OUT | String | - | 저장된 이미지 URL |
| result.suspectedDisease | OUT | String | - | 의심되는 질환명 |
| result.probability | OUT | Integer | - | 진단 확률 (0-100) |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/v1/diagnoses",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "multipart/form-data"
  },
  "body": {
    "image": "[File Object]"
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "diagnosisId": 1,
    "imageUrl": "/uploads/diagnosis_1.jpg",
    "result": {
      "suspectedDisease": "기저세포암",
      "probability": 78
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "diagnosisId": 1,
  "imageUrl": "/uploads/diagnosis_1.jpg",
  "result": {
    "suspectedDisease": "기저세포암",
    "probability": 78
  }
}
```

---

### 진단 이력 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Diagnosis History
- **엔드포인트**: `/diagnoses/history`
- **메서드**: GET
- **설명**: 사용자 진단 이력 목록 조회

### 페이지네이션 필요성
진단 이력 조회에서 페이지네이션은 다음과 같은 이유로 필수적입니다:

1. **데이터 양 방지**: 사용자가 여러 번 진단할 경우 수백~수천개의 기록이 누적될 수 있음
2. **성능 최적화**: 한 번에 모든 데이터를 로드하면 서버 부하와 클라이언트 성능 저하
3. **사용자 경험**: 모바일 환경에서 적절한 개수(5개)씩 보여주는 것이 가장 효율적
4. **네트워크 효율성**: 작은 단위로 나누어 전송 속도 향상과 데이터 요금 절약
5. **서버 리소스 관리**: 데이터베이스 쿼리 부하 줄이고 메모리 사용량 최적화

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| size | IN | Integer | No | 5 | 페이지당 데이터 수 |
| items[].id | OUT | Integer | - | - | 진단 이력 고유 ID |
| items[].date | OUT | String | - | - | 진단 날짜 (YYYY.MM.DD) |
| items[].result | OUT | String | - | - | 진단 결과 (질환명) |
| items[].score | OUT | Integer | - | - | 진단 확률 (0-100) |
| items[].thumbnail | OUT | String | - | - | 진단 이미지 썸네일 경로 |
| pagination.currentPage | OUT | Integer | - | - | 현재 페이지 |
| pagination.totalPages | OUT | Integer | - | - | 총 페이지 수 |
| pagination.totalItems | OUT | Integer | - | - | 총 항목 수 |
| pagination.hasNext | OUT | Boolean | - | - | 다음 페이지 존재 여부 |
| pagination.hasPrev | OUT | Boolean | - | - | 이전 페이지 존재 여부 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/diagnoses/history?page=1&size=5",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "items": [
      {
        "id": 1,
        "date": "2026.03.01",
        "result": "기저세포암",
        "score": 78,
        "thumbnail": "/img/1.jpg"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 24,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "items": [
    {
      "id": 1,
      "date": "2026.03.01",
      "result": "기저세포암",
      "score": 78,
      "thumbnail": "/img/1.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 24,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 3. 프로필 API (Profile)

### 내 프로필 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get My Profile
- **엔드포인트**: `/users/me`
- **메서드**: GET
- **설명**: 현재 로그인된 사용자 프로필 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | OUT | Integer | - | 사용자 고유 ID |
| name | OUT | String | - | 사용자 이름 |
| email | OUT | String | - | 사용자 이메일 주소 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/users/me",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "id": 1,
    "name": "홍길동",
    "email": "user@example.com"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "name": "홍길동",
  "email": "user@example.com"
}
```

---

### 회원탈퇴 API

## API 개요

### 기본 정보
- **API 이름**: Delete My Account
- **엔드포인트**: `/users/me`
- **메서드**: DELETE
- **설명**: 사용자 계정 영구 삭제

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| confirmText | IN | String | Yes | 확인 텍스트 ("계정삭제") |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "DELETE",
  "url": "/api/v1/users/me",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "confirmText": "계정삭제"
  }
}
```

### 응답 (Response)
```json
{
  "status": 204,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null
}
```

---

## 응답 예시

### 성공 응답 (204 No Content)
```json
// 응답 데이터 없음
```

---

## 4. 공지사항 API (Notice)

### 공지사항 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Notices
- **엔드포인트**: `/notices`
- **메서드**: GET
- **설명**: 앱 공지사항 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| size | IN | Integer | No | 5 | 페이지당 데이터 수 |
| items[].id | OUT | Integer | - | - | 공지 고유 ID |
| items[].title | OUT | String | - | - | 공지 제목 |
| items[].content | OUT | String | - | - | 공지 내용 |
| items[].createdAt | OUT | String | - | - | 생성 일시 (ISO 8601) |
| items[].date | OUT | String | - | - | 표시용 날짜 (YYYY.MM.DD) |
| pagination.currentPage | OUT | Integer | - | - | 현재 페이지 |
| pagination.totalPages | OUT | Integer | - | - | 총 페이지 수 |
| pagination.totalItems | OUT | Integer | - | - | 총 항목 수 |
| pagination.hasNext | OUT | Boolean | - | - | 다음 페이지 존재 여부 |
| pagination.hasPrev | OUT | Boolean | - | - | 이전 페이지 존재 여부 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/notices?page=1&size=20",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "items": [
      {
        "id": 1,
        "title": "🎉 v1.2.0 업데이트",
        "content": "새로운 피부 분석 기능이 추가되었습니다.",
        "createdAt": "2026-03-15T00:00:00Z",
        "date": "2026.03.15",
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 4,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "items": [
    {
      "id": 1,
      "title": "🎉 v1.2.0 업데이트",
      "content": "새로운 피부 분석 기능이 추가되었습니다.",
      "createdAt": "2026-03-15T00:00:00Z",
      "date": "2026.03.15",
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 4,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

## 5. 피드백 API (Feedback)

### 피드백 전송 API

## API 개요

### 기본 정보
- **API 이름**: Send Feedback
- **엔드포인트**: `/feedback`
- **메서드**: POST
- **설명**: 사용자 피드백 제출

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| rating | IN | Integer | Yes | 앱 만족도 (1-5) |
| message | IN | String | Yes | 피드백 내용 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/v1/feedback",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "rating": 5,
    "message": "좋은 앱입니다!"
  }
}
```

### 응답 (Response)
```json
{
  "status": 204,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null
}
```

---

### 내 피드백 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get My Feedbacks
- **엔드포인트**: `/feedback/my`
- **메서드**: GET
- **설명**: 내가 작성한 피드백 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| size | IN | Integer | No | 10 | 페이지당 데이터 수 |
| items[].id | OUT | Integer | - | - | 피드백 고유 ID |
| items[].userId | OUT | Integer | - | - | 작성자 ID |
| items[].userName | OUT | String | - | - | 작성자 이름 |
| items[].userEmail | OUT | String | - | - | 작성자 이메일 |
| items[].rating | OUT | Integer | - | - | 앱 만족도 (1-5) |
| items[].message | OUT | String | - | - | 피드백 내용 |
| items[].createdAt | OUT | String | - | - | 작성 일시 |
| items[].adminReply | OUT | String | - | - | 관리자 답변 |
| pagination.currentPage | OUT | Integer | - | - | 현재 페이지 |
| pagination.totalPages | OUT | Integer | - | - | 총 페이지 수 |
| pagination.totalItems | OUT | Integer | - | - | 총 항목 수 |
| pagination.hasNext | OUT | Boolean | - | - | 다음 페이지 존재 여부 |
| pagination.hasPrev | OUT | Boolean | - | - | 이전 페이지 존재 여부 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/feedback/my?page=1&size=10",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "items": [
      {
        "id": 1,
        "userId": 123,
        "userName": "홍길동",
        "userEmail": "user@example.com",
        "rating": 5,
        "message": "앱이 정말 유용합니다!",
        "createdAt": "2026-04-28T10:30:00Z",
        "adminReply": "소중한 의견 감사합니다.",
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 3,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 내 피드백 삭제 API

## API 개요

### 기본 정보
- **API 이름**: Delete My Feedback
- **엔드포인트**: `/feedback/my/{id}`
- **메서드**: DELETE
- **설명**: 내가 작성한 피드백 삭제

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | IN | Integer | Yes | 삭제할 피드백 ID |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "DELETE",
  "url": "/api/v1/feedback/my/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 204,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null
}
```

---

## 6. 백과사전 API (Encyclopedia)

### 백과사전 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Encyclopedia Entries
- **엔드포인트**: `/encyclopedia`
- **메서드**: GET
- **설명**: 피부 종양 관련 정보 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| query | IN | String | No | "" | 검색어 |
| page | IN | Integer | No | 1 | 페이지 번호 |
| size | IN | Integer | No | 5 | 페이지당 데이터 수 |
| items[].id | OUT | Integer | - | - | 항목 고유 ID |
| items[].title | OUT | String | - | - | 제목 |
| items[].content | OUT | String | - | - | 상세 내용 |
| pagination.currentPage | OUT | Integer | - | - | 현재 페이지 |
| pagination.totalPages | OUT | Integer | - | - | 총 페이지 수 |
| pagination.totalItems | OUT | Integer | - | - | 총 항목 수 |
| pagination.hasNext | OUT | Boolean | - | - | 다음 페이지 존재 여부 |
| pagination.hasPrev | OUT | Boolean | - | - | 이전 페이지 존재 여부 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/encyclopedia?query=피부&page=1&size=5",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "items": [
      {
        "id": 1,
        "title": "피부 종양이란?",
        "content": "피부 종양은 피부에 발생하는 비정상적인 조직 증식입니다."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "items": [
    {
      "id": 1,
      "title": "피부 종양이란?",
      "content": "피부 종양은 피부에 발생하는 비정상적인 조직 증식입니다."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 7. (미확정)병원 찾기 API (Hospital)

### 근처 병원 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Nearby Hospitals
- **엔드포인트**: `/hospitals/nearby`
- **메서드**: GET
- **설명**: 근처 피부과 병원 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| lat | IN | Number | Yes | - | 위도 |
| lng | IN | Number | Yes | - | 경도 |
| sort | IN | String | No | "distance" | 정렬 방식 ("distance" 또는 "rating") |
| page | IN | Integer | No | 1 | 페이지 번호 |
| size | IN | Integer | No | 3 | 페이지당 데이터 수 |
| items[].id | OUT | Integer | - | - | 병원 고유 ID |
| items[].name | OUT | String | - | - | 병원명 |
| items[].address | OUT | String | - | - | 전체 주소 |
| items[].phone | OUT | String | - | - | 전화번호 |
| items[].hours | OUT | String | - | - | 영업시간 |
| items[].rating | OUT | Number | - | - | 평점 (0-5) |
| items[].distanceKm | OUT | Number | - | - | 거리 (km) |
| items[].isOpen | OUT | Boolean | - | - | 현재 영업 여부 |
| items[].mapUrl | OUT | String | - | - | 지도 서비스 링크 |
| pagination.currentPage | OUT | Integer | - | - | 현재 페이지 |
| pagination.totalPages | OUT | Integer | - | - | 총 페이지 수 |
| pagination.totalItems | OUT | Integer | - | - | 총 항목 수 |
| pagination.hasNext | OUT | Boolean | - | - | 다음 페이지 존재 여부 |
| pagination.hasPrev | OUT | Boolean | - | - | 이전 페이지 존재 여부 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/hospitals/nearby?lat=37.4979&lng=127.0276&sort=distance&page=1&size=3",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 응답 (Response)
```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "items": [
      {
        "id": 1,
        "name": "서울 스킨 클리닉",
        "address": "서울시 강남구 테헤란로 123",
        "phone": "02-1234-5678",
        "hours": "09:00 - 18:00",
        "rating": 4.8,
        "distanceKm": 0.5,
        "isOpen": true,
        "mapUrl": "https://maps.google.com/?q=서울+스킨+클리닉"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 4,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "items": [
    {
      "id": 1,
      "name": "서울 스킨 클리닉",
      "address": "서울시 강남구 테헤란로 123",
      "phone": "02-1234-5678",
      "hours": "09:00 - 18:00",
      "rating": 4.8,
      "distanceKm": 0.5,
      "isOpen": true,
      "mapUrl": "https://maps.google.com/?q=서울+스킨+클리닉"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

> 마지막 업데이트: 2026-04-28
> 
> 본 문서는 SkinAI 앱의 모든 API를 첨부된 양식에 맞춰 정리한 명세서입니다.
