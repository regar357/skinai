# SkinAI 관리자 웹 API 문서

---

## 1. 인증 API (Authentication)

### 관리자 로그인 API

## API 개요

### 기본 정보
- **API 이름**: Admin Login
- **엔드포인트**: `/admin/login`
- **메서드**: POST
- **설명**: 관리자 로그인 처리

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| email | IN | String | Yes | 관리자 이메일 |
| password | IN | String | Yes | 비밀번호 |
| token | OUT | String | - | JWT 액세스 토큰 |
| user.id | OUT | Integer | - | 사용자 ID |
| user.email | OUT | String | - | 사용자 이메일 |
| user.nickname | OUT | String | - | 사용자 닉네임 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/admin/login",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "admin@example.com",
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "nickname": "관리자"
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "nickname": "관리자"
  }
}
```

---

### 로그아웃 API

## API 개요

### 기본 정보
- **API 이름**: Logout
- **엔드포인트**: `/auth/logout`
- **메서드**: POST
- **설명**: 로그아웃 처리

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| (없음) | - | - | - | 요청 본문 없음 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/auth/logout",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {}
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
    "message": "로그아웃 성공"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "message": "로그아웃 성공"
}
```

---

## 2. 사용자 관리 API (Users)

### 사용자 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get All Users
- **엔드포인트**: `/admin/users`
- **메서드**: GET
- **설명**: 관리자용 전체 사용자 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| limit | IN | Integer | No | 10 | 페이지당 데이터 수 |
| status | IN | String | No | "" | 사용자 상태 필터 (ACTIVE, SUSPENDED, DELETED) |
| search | IN | String | No | "" | 검색어 (사용자명, 이메일) |
| items[].id | OUT | Integer | - | - | 사용자 고유 ID |
| items[].username | OUT | String | - | - | 사용자 이름 |
| items[].email | OUT | String | - | - | 사용자 이메일 주소 |
| items[].status | OUT | String | - | - | 사용자 상태 (ACTIVE, SUSPENDED, DELETED) |
| items[].joinDate | OUT | String | - | - | 가입일 |
| items[].lastLogin | OUT | String | - | - | 마지막 로그인일 |
| items[].analysisCount | OUT | Integer | - | - | 분석 횟수 |
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
  "url": "/api/admin/users?page=1&limit=10&status=ACTIVE&search=김",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
        "username": "홍길동",
        "email": "user@example.com",
        "status": "ACTIVE",
        "joinDate": "2024-01-15",
        "lastLogin": "2024-07-21",
        "analysisCount": 25
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
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
      "username": "홍길동",
      "email": "user@example.com",
      "status": "ACTIVE",
      "joinDate": "2024-01-15",
      "lastLogin": "2024-07-21",
      "analysisCount": 25
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 사용자 정지 API

## API 개요

### 기본 정보
- **API 이름**: Suspend User
- **엔드포인트**: `/admin/users/{userId}/suspend`
- **메서드**: PATCH
- **설명**: 사용자 계정 정지 처리

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| userId | IN | Integer | Yes | 정지할 사용자 ID |
| id | OUT | Integer | - | 사용자 고유 ID |
| username | OUT | String | - | 사용자 이름 |
| email | OUT | String | - | 사용자 이메일 주소 |
| status | OUT | String | - | 변경된 사용자 상태 (SUSPENDED) |
| joinDate | OUT | String | - | 가입일 |
| lastLogin | OUT | String | - | 마지막 로그인일 |
| analysisCount | OUT | Integer | - | 분석 횟수 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "PATCH",
  "url": "/api/admin/users/1/suspend",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "username": "홍길동",
    "email": "user@example.com",
    "status": "SUSPENDED",
    "joinDate": "2024-01-15",
    "lastLogin": "2024-07-21",
    "analysisCount": 25
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "username": "홍길동",
  "email": "user@example.com",
  "status": "SUSPENDED",
  "joinDate": "2024-01-15",
  "lastLogin": "2024-07-21",
  "analysisCount": 25
}
```

---

### 사용자 정지 해제 API

## API 개요

### 기본 정보
- **API 이름**: Unsuspend User
- **엔드포인트**: `/admin/users/{userId}/unsuspend`
- **메서드**: PATCH
- **설명**: 사용자 계정 정지 해제 처리

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| userId | IN | Integer | Yes | 정지 해제할 사용자 ID |
| id | OUT | Integer | - | 사용자 고유 ID |
| username | OUT | String | - | 사용자 이름 |
| email | OUT | String | - | 사용자 이메일 주소 |
| status | OUT | String | - | 변경된 사용자 상태 (ACTIVE) |
| joinDate | OUT | String | - | 가입일 |
| lastLogin | OUT | String | - | 마지막 로그인일 |
| analysisCount | OUT | Integer | - | 분석 횟수 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "PATCH",
  "url": "/api/admin/users/1/unsuspend",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "username": "홍길동",
    "email": "user@example.com",
    "status": "ACTIVE",
    "joinDate": "2024-01-15",
    "lastLogin": "2024-07-21",
    "analysisCount": 25
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "username": "홍길동",
  "email": "user@example.com",
  "status": "ACTIVE",
  "joinDate": "2024-01-15",
  "lastLogin": "2024-07-21",
  "analysisCount": 25
}
```

---

### 사용자 삭제 API

## API 개요

### 기본 정보
- **API 이름**: Delete User
- **엔드포인트**: `/admin/users/{userId}`
- **메서드**: DELETE
- **설명**: 사용자 계정 영구 삭제

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| userId | IN | Integer | Yes | 삭제할 사용자 ID |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "DELETE",
  "url": "/api/admin/users/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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

## 2. 피드백 관리 API (Feedbacks)

### 관리자용 피드백 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Admin Feedbacks
- **엔드포인트**: `/admin/feedbacks`
- **메서드**: GET
- **설명**: 관리자용 전체 피드백 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| limit | IN | Integer | No | 10 | 페이지당 데이터 수 |
| status | IN | String | No | "" | 피드백 상태 필터 |
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
  "url": "/api/admin/feedbacks?page=1&limit=10",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
        "status": "answered",
        "rating": 5,
        "message": "앱이 정말 유용합니다!",
        "createdAt": "2024-07-21T10:30:00Z",
        "adminReply": "소중한 의견 감사합니다."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
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
      "userId": 123,
      "userName": "홍길동",
      "userEmail": "user@example.com",
      "status": "answered",
      "rating": 5,
      "message": "앱이 정말 유용합니다!",
      "createdAt": "2024-07-21T10:30:00Z",
      "adminReply": "소중한 의견 감사합니다."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 피드백 답변 API

## API 개요

### 기본 정보
- **API 이름**: Reply to Feedback
- **엔드포인트**: `/admin/feedbacks/{feedbackId}/reply`
- **메서드**: POST
- **설명**: 피드백에 관리자 답변 추가

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| feedbackId | IN | Integer | Yes | 답변할 피드백 ID |
| reply_text | IN | String | Yes | 관리자 답변 내용 |
| id | OUT | Integer | - | 피드백 고유 ID |
| userId | OUT | Integer | - | 작성자 ID |
| userName | OUT | String | - | 작성자 이름 |
| userEmail | OUT | String | - | 작성자 이메일 |
| status | OUT | String | - | 피드백 상태 (pending/answered) |
| rating | OUT | Integer | - | 앱 만족도 (1-5) |
| message | OUT | String | - | 피드백 내용 |
| createdAt | OUT | String | - | 작성 일시 |
| adminReply | OUT | String | - | 관리자 답변 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/admin/feedbacks/1/reply",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "reply_text": "소중한 의견 감사합니다. 더 나은 서비스를 제공하도록 노력하겠습니다."
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
    "userId": 123,
    "userName": "홍길동",
    "userEmail": "user@example.com",
    "status": "answered",
    "rating": 5,
    "message": "앱이 정말 유용합니다!",
    "createdAt": "2024-07-21T10:30:00Z",
    "adminReply": "소중한 의견 감사합니다. 더 나은 서비스를 제공하도록 노력하겠습니다."
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "userId": 123,
  "userName": "홍길동",
  "userEmail": "user@example.com",
  "status": "answered",
  "rating": 5,
  "message": "앱이 정말 유용합니다!",
  "createdAt": "2024-07-21T10:30:00Z",
  "adminReply": "소중한 의견 감사합니다. 더 나은 서비스를 제공하도록 노력하겠습니다."
}
```

---

## 3. 검사 기록 관리 API (Analysis)

### 검사 기록 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Exam Records
- **엔드포인트**: `/admin/analyses/records`
- **메서드**: GET
- **설명**: 관리자용 전체 검사 기록 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| limit | IN | Integer | No | 10 | 페이지당 데이터 수 |
| search | IN | String | No | "" | 검색어 (사용자명, 질환명) |
| items[].id | OUT | Integer | - | - | 검사 기록 고유 ID |
| items[].username | OUT | String | - | - | 사용자 이름 |
| items[].userId | OUT | String | - | - | 사용자 ID |
| items[].examDate | OUT | String | - | - | 검사일 |
| items[].imageId | OUT | String | - | - | 이미지 ID |
| items[].suspectedDisease | OUT | String | - | - | 의심 질환명 |
| items[].confidence | OUT | Integer | - | - | 신뢰도 (%) |
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
  "url": "/api/admin/analyses/records?page=1&limit=10&search=기저세포암",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
        "id": 1001,
        "username": "김철수",
        "userId": "user123",
        "examDate": "2024-07-21",
        "imageId": "IMG_20240721_001",
        "suspectedDisease": "기저세포암",
        "confidence": 94
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalItems": 75,
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
      "id": 1001,
      "username": "김철수",
      "userId": "user123",
      "examDate": "2024-07-21",
      "imageId": "IMG_20240721_001",
      "suspectedDisease": "기저세포암",
      "confidence": 94
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalItems": 75,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 이미지 정보 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Image Info
- **엔드포인트**: `/admin/analyses/images/{imageId}`
- **메서드**: GET
- **설명**: 검사 이미지 상세 정보 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| imageId | IN | String | Yes | 조회할 이미지 ID |
| imageId | OUT | String | - | 이미지 고유 ID |
| imageUrl | OUT | String | - | 이미지 URL |
| fileName | OUT | String | - | 파일명 |
| fileSize | OUT | Integer | - | 파일 크기 (bytes) |
| uploadedAt | OUT | String | - | 업로드 일시 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/analyses/images/IMG_20240721_001",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "imageId": "IMG_20240721_001",
    "imageUrl": "/uploads/images/IMG_20240721_001.jpg",
    "fileName": "IMG_20240721_001.jpg",
    "fileSize": 2621440,
    "uploadedAt": "2024-07-21T10:30:00Z"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "imageId": "IMG_20240721_001",
  "imageUrl": "/uploads/images/IMG_20240721_001.jpg",
  "fileName": "IMG_20240721_001.jpg",
  "fileSize": 2621440,
  "uploadedAt": "2024-07-21T10:30:00Z"
}
```

---

## 4. 백과사전 관리 API (Content - Diseases)

### 백과사전 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get All Diseases
- **엔드포인트**: `/diseases`
- **메서드**: GET
- **설명**: 피부 백과사전 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| limit | IN | Integer | No | 10 | 페이지당 데이터 수 |
| items[].id | OUT | Integer | - | - | 고유 ID |
| items[].title | OUT | String | - | - | 제목 |
| items[].description | OUT | String | - | - | 설명 |
| items[].modifiedDate | OUT | String | - | - | 수정일 |
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
  "url": "/api/diseases?page=1&limit=10",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
        "title": "기저세포암",
        "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장합니다.",
        "modifiedDate": "2024-07-18"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
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
      "title": "기저세포암",
      "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장합니다.",
      "modifiedDate": "2024-07-18"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 백과사전 상세 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Disease Detail
- **엔드포인트**: `/admin/diseases/{diseaseId}`
- **메서드**: GET
- **설명**: 백과사전 항목 상세 정보 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| diseaseId | IN | Integer | Yes | 조회할 질병 ID |
| id | OUT | Integer | - | 질병 ID |
| title | OUT | String | - | 질병 제목 |
| description | OUT | String | - | 질병 설명 |
| modifiedDate | OUT | String | - | 수정일 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/diseases/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "title": "기저세포암",
    "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장하며 조기 발견이 중요합니다. 주로 얼굴, 목, 손 등 노출된 부위에 발생하며, 왁스 같은 결절이나 피부색 변화로 나타날 수 있습니다. 자외선 노출이 주요 원인으로 알려져 있으며, 정기적인 피부 검진이 중요합니다.",
    "modifiedDate": "2024-07-21"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "title": "기저세포암",
  "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장하며 조기 발견이 중요합니다. 주로 얼굴, 목, 손 등 노출된 부위에 발생하며, 왁스 같은 결절이나 피부색 변화로 나타날 수 있습니다. 자외선 노출이 주요 원인으로 알려져 있으며, 정기적인 피부 검진이 중요합니다.",
  "modifiedDate": "2024-07-21"
}
```

---

### 백과사전 생성 API

## API 개요

### 기본 정보
- **API 이름**: Create Disease
- **엔드포인트**: `/admin/diseases`
- **메서드**: POST
- **설명**: 새로운 백과사전 항목 생성

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| title | IN | String | Yes | 제목 |
| description | IN | String | Yes | 설명 |
| id | OUT | Integer | - | 고유 ID |
| title | OUT | String | - | 제목 |
| description | OUT | String | - | 설명 |
| modifiedDate | OUT | String | - | 수정일 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/admin/diseases",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "편평상피세포암",
    "description": "편평상피세포의 비정상적인 증식으로 발생하는 피부암입니다."
  }
}
```

### 응답 (Response)
```json
{
  "status": 201,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "id": 16,
    "title": "편평상피세포암",
    "description": "편평상피세포의 비정상적인 증식으로 발생하는 피부암입니다.",
    "modifiedDate": "2024-07-21"
  }
}
```

---

## 응답 예시

### 성공 응답 (201 Created)
```json
{
  "id": 16,
  "title": "편평상피세포암",
  "description": "편평상피세포의 비정상적인 증식으로 발생하는 피부암입니다.",
  "modifiedDate": "2024-07-21"
}
```

---

### 백과사전 수정 API

## API 개요

### 기본 정보
- **API 이름**: Update Disease
- **엔드포인트**: `/admin/diseases/{diseaseId}`
- **메서드**: PUT
- **설명**: 백과사전 항목 수정

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | IN | Integer | Yes | 수정할 ID |
| title | IN | String | No | 제목 |
| description | IN | String | No | 설명 |
| id | OUT | Integer | - | 고유 ID |
| title | OUT | String | - | 제목 |
| description | OUT | String | - | 설명 |
| modifiedDate | OUT | String | - | 수정일 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "PUT",
  "url": "/api/admin/diseases/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "기저세포암",
    "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장하며 조기 발견이 중요합니다."
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
    "title": "기저세포암",
    "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장하며 조기 발견이 중요합니다.",
    "modifiedDate": "2024-07-21"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "id": 1,
  "title": "기저세포암",
  "description": "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장하며 조기 발견이 중요합니다.",
  "modifiedDate": "2024-07-21"
}
```

---

### 백과사전 삭제 API

## API 개요

### 기본 정보
- **API 이름**: Delete Disease
- **엔드포인트**: `/admin/diseases/{diseaseId}`
- **메서드**: DELETE
- **설명**: 백과사전 항목 삭제

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | IN | Integer | Yes | 삭제할 ID |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "DELETE",
  "url": "/api/admin/diseases/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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

## 5. 대시보드 API (Dashboard)

### 대시보드 통계 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Dashboard Stats
- **엔드포인트**: `/admin/dashboard/stats`
- **메서드**: GET
- **설명**: 대시보드 통계 정보 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| totalUsers | OUT | Integer | - | 총 사용자 수 |
| activeUsers | OUT | Integer | - | 활성 사용자 수 |
| totalAnalyses | OUT | Integer | - | 총 분석 건수 |
| todayAnalyses | OUT | Integer | - | 오늘 분석 건수 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/dashboard/stats",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "totalUsers": 1234,
    "activeUsers": 892,
    "totalAnalyses": 5678,
    "todayAnalyses": 45
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "totalUsers": 1234,
  "activeUsers": 892,
  "totalAnalyses": 5678,
  "todayAnalyses": 45
}
```

---

### 진단 건수 추이 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Diagnosis Trend
- **엔드포인트**: `/admin/dashboard/diagnosis-trend`
- **메서드**: GET
- **설명**: 월별 진단 건수 추이 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| [].month | OUT | String | - | 월 (1월, 2월...) |
| [].value | OUT | Integer | - | 진단 건수 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/dashboard/diagnosis-trend",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
  "body": [
    {
      "month": "1월",
      "value": 120
    },
    {
      "month": "2월",
      "value": 150
    }
  ]
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
[
  {
    "month": "1월",
    "value": 120
  },
  {
    "month": "2월",
    "value": 150
  }
]
```

---

### 질환별 분포 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Disease Distribution
- **엔드포인트**: `/admin/dashboard/disease-distribution`
- **메서드**: GET
- **설명**: 질환별 분포 현황 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| [].name | OUT | String | - | 질환명 |
| [].value | OUT | Integer | - | 진단 건수 |
| [].percentage | OUT | Integer | - | 비율 (%) |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/dashboard/disease-distribution",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
  "body": [
    {
      "name": "기저세포암",
      "value": 45,
      "percentage": 28
    },
    {
      "name": "편평세포암",
      "value": 32,
      "percentage": 20
    }
  ]
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
[
  {
    "name": "기저세포암",
    "value": 45,
    "percentage": 28
  },
  {
    "name": "편평세포암",
    "value": 32,
    "percentage": 20
  }
]
```

---

### 사용자 추이 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get User Trend
- **엔드포인트**: `/admin/dashboard/user-trend`
- **메서드**: GET
- **설명**: 월별 사용자 추이 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| [].month | OUT | String | - | 월 (1월, 2월...) |
| [].active | OUT | Integer | - | 활성 사용자 수 |
| [].new | OUT | Integer | - | 신규 사용자 수 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/dashboard/user-trend",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
  "body": [
    {
      "month": "1월",
      "active": 45,
      "new": 50
    },
    {
      "month": "2월",
      "active": 60,
      "new": 65
    }
  ]
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
[
  {
    "month": "1월",
    "active": 45,
    "new": 50
  },
  {
    "month": "2월",
    "active": 60,
    "new": 65
  }
]
```

---

## 6. AI 모니터링 API (Monitoring)

### 성능 지표 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Performance Metrics
- **엔드포인트**: `/admin/monitoring/performance`
- **메서드**: GET
- **설명**: AI 모델 성능 지표 데이터 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| [].month | OUT | String | - | 월별 데이터 (1월, 2월...) |
| [].정확도 | OUT | Number | - | 정확도 (%) |
| [].정밀도 | OUT | Number | - | 정밀도 (%) |
| [].재현율 | OUT | Number | - | 재현율 (%) |
| [].F1점수 | OUT | Number | - | F1 점수 (%) |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/monitoring/performance",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
  "body": [
    {
      "month": "1월",
      "정확도": 92.3,
      "정밀도": 89.7,
      "재현율": 91.2,
      "F1점수": 90.4
    },
    {
      "month": "2월",
      "정확도": 93.5,
      "정밀도": 90.8,
      "재현율": 92.6,
      "F1점수": 91.7
    }
  ]
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
[
  {
    "month": "1월",
    "정확도": 92.3,
    "정밀도": 89.7,
    "재현율": 91.2,
    "F1점수": 90.4
  },
  {
    "month": "2월",
    "정확도": 93.5,
    "정밀도": 90.8,
    "재현율": 92.6,
    "F1점수": 91.7
  }
]
```

---

### 질병 정확도 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Disease Accuracy
- **엔드포인트**: `/admin/monitoring/disease-accuracy`
- **메서드**: GET
- **설명**: 질병별 진단 정확도 데이터 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| [].name | OUT | String | - | 질병명 |
| [].value | OUT | Number | - | 정확도 (%) |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/monitoring/disease-accuracy",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
  "body": [
    {
      "name": "기저세포암",
      "value": 96.5
    },
    {
      "name": "편평세포암",
      "value": 94.2
    }
  ]
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
[
  {
    "name": "기저세포암",
    "value": 96.5
  },
  {
    "name": "편평세포암",
    "value": 94.2
  }
]
```

---


### 시스템 상태 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get System Status
- **엔드포인트**: `/admin/monitoring/system-status`
- **메서드**: GET
- **설명**: 시스템 상태 정보 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| averageResponseTime | OUT | Number | - | 평균 응답시간 (ms) |
| dailyRequests | OUT | Integer | - | 일일 요청량 |
| errorRate | OUT | Number | - | 오류율 (%) |
| uptime | OUT | Number | - | 가동 시간 (%) |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/monitoring/system-status",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "averageResponseTime": 2300,
    "dailyRequests": 15234,
    "errorRate": 0.8,
    "uptime": 99.9
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "averageResponseTime": 2300,
  "dailyRequests": 15234,
  "errorRate": 0.8,
  "uptime": 99.9
}
```

---

### 모델 정보 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Model Info
- **엔드포인트**: `/admin/monitoring/model-info`
- **메서드**: GET
- **설명**: AI 모델 정보 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| modelVersion | OUT | String | - | 모델 버전 |
| lastTrained | OUT | String | - | 마지막 학습일 |
| dataset | OUT | String | - | 학습 데이터셋 |
| architecture | OUT | String | - | 모델 아키텍처 |
| inputSize | OUT | String | - | 입력 크기 |
| classes | OUT | String | - | 분류 클래스 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/monitoring/model-info",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "modelVersion": "EfficientNet-B4 v2.1",
    "lastTrained": "2024-07-15",
    "dataset": "ISIC 2024 (15,234 이미지)",
    "architecture": "EfficientNet-B4",
    "inputSize": "380x380 RGB",
    "classes": "7개 질환 클래스"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "modelVersion": "EfficientNet-B4 v2.1",
  "lastTrained": "2024-07-15",
  "dataset": "ISIC 2024 (15,234 이미지)",
  "architecture": "EfficientNet-B4",
  "inputSize": "380x380 RGB",
  "classes": "7개 질환 클래스"
}
```

---

## 6. 공지사항 관리 API (Content - Notices)

### 공지사항 목록 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get All Notices
- **엔드포인트**: `/admin/notices`
- **메서드**: GET
- **설명**: 관리자용 전체 공지사항 목록 조회

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|----------|------|----------|--------|------|
| page | IN | Integer | No | 1 | 페이지 번호 |
| limit | IN | Integer | No | 10 | 페이지당 데이터 수 |
| search | IN | String | No | "" | 검색어 (제목, 내용) |
| items[].notice_id | OUT | Integer | - | - | 공지사항 고유 ID |
| items[].title | OUT | String | - | - | 제목 |
| items[].content | OUT | String | - | - | 내용 |
| items[].created_at | OUT | String | - | - | 생성일 |
| items[].updated_at | OUT | String | - | - | 수정일 |
| pagination.page | OUT | Integer | - | - | 현재 페이지 |
| pagination.limit | OUT | Integer | - | - | 페이지당 데이터 수 |
| pagination.total | OUT | Integer | - | - | 총 항목 수 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/admin/notices?page=1&limit=10&search=업데이트",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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
    "data": [
      {
        "notice_id": 1,
        "title": "SkinAI 관리자 시스템 업데이트 안내",
        "content": "SkinAI 관리자 시스템이 새롭게 업데이트되었습니다.",
        "created_at": "2024-07-20",
        "updated_at": "2024-07-20"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "data": [
    {
      "notice_id": 1,
      "title": "SkinAI 관리자 시스템 업데이트 안내",
      "content": "SkinAI 관리자 시스템이 새롭게 업데이트되었습니다.",
      "created_at": "2024-07-20",
      "updated_at": "2024-07-20"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

### 공지사항 생성 API

## API 개요

### 기본 정보
- **API 이름**: Create Notice
- **엔드포인트**: `/admin/notices`
- **메서드**: POST
- **설명**: 새로운 공지사항 생성

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| title | IN | String | Yes | 제목 |
| content | IN | String | Yes | 내용 |
| notice_id | OUT | Integer | - | 공지사항 고유 ID |
| title | OUT | String | - | 제목 |
| content | OUT | String | - | 내용 |
| created_at | OUT | String | - | 생성일 |
| updated_at | OUT | String | - | 수정일 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/admin/notices",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "시스템 점검 안내",
    "content": "정기 점검이 예정되어 있습니다."
  }
}
```

### 응답 (Response)
```json
{
  "status": 201,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "notice_id": 26,
    "title": "시스템 점검 안내",
    "content": "정기 점검이 예정되어 있습니다.",
    "created_at": "2024-07-21"
  }
}
```

---

## 응답 예시

### 성공 응답 (201 Created)
```json
{
  "notice_id": 26,
  "title": "시스템 점검 안내",
  "content": "정기 점검이 예정되어 있습니다.",
  "created_at": "2024-07-21"
}
```

---

### 공지사항 수정 API

## API 개요

### 기본 정보
- **API 이름**: Update Notice
- **엔드포인트**: `/admin/notices/{noticeId}`
- **메서드**: PUT
- **설명**: 공지사항 수정

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| noticeId | IN | Integer | Yes | 수정할 공지사항 ID |
| title | IN | String | No | 제목 |
| content | IN | String | No | 내용 |
| notice_id | OUT | Integer | - | 공지사항 고유 ID |
| title | OUT | String | - | 제목 |
| content | OUT | String | - | 내용 |
| created_at | OUT | String | - | 생성일 |
| updated_at | OUT | String | - | 수정일 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "PUT",
  "url": "/api/admin/notices/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "SkinAI 관리자 시스템 업데이트 안내",
    "content": "SkinAI 관리자 시스템이 새롭게 업데이트되었습니다. 개선된 기능을 확인해보세요."
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
    "notice_id": 1,
    "title": "SkinAI 관리자 시스템 업데이트 안내",
    "content": "SkinAI 관리자 시스템이 새롭게 업데이트되었습니다. 개선된 기능을 확인해보세요.",
    "created_at": "2024-07-20",
    "updated_at": "2024-07-21"
  }
}
```

---

## 응답 예시

### 성공 응답 (200 OK)
```json
{
  "notice_id": 1,
  "title": "SkinAI 관리자 시스템 업데이트 안내",
  "content": "SkinAI 관리자 시스템이 새롭게 업데이트되었습니다. 개선된 기능을 확인해보세요.",
  "created_at": "2024-07-20",
  "updated_at": "2024-07-21"
}
```

---

### 공지사항 삭제 API

## API 개요

### 기본 정보
- **API 이름**: Delete Notice
- **엔드포인트**: `/admin/notices/{noticeId}`
- **메서드**: DELETE
- **설명**: 공지사항 삭제

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| noticeId | IN | Integer | Yes | 삭제할 공지사항 ID |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "DELETE",
  "url": "/api/admin/notices/1",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json"
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

## 7. 검색 기능 API 통합 안내

### 검색 파라미터 공통 사항

모든 목록 조회 API에 아래 검색 파라미터가 추가되었습니다:

| 파라미터명 | 타입 | 필수여부 | 기본값 | 설명 |
|-----------|------|----------|--------|------|
| search | String | No | "" | 검색어 (각 페이지별 검색 대상 다름) |

### 검색 대상별 기능

| API | 검색 대상 | 검색 필드 |
|-----|-----------|-----------|
| 사용자 관리 | 사용자 정보 | username, email |
| 공지사항 | 공지사항 | title, content |
| 백과사전 | 질병 정보 | title, description |
| 검사기록 | 검사 기록 | username, userId, result |

### 검색 기능 사용 예시

```bash
# 사용자 검색
GET /api/admin/users?search=김

# 공지사항 검색
GET /api/admin/notices?search=업데이트

# 백과사전 검색
GET /api/diseases?search=기저세포암

# 검사기록 검색
GET /api/admin/analyses/records?search=김철수
```

---

> 
> 본 문서는 SkinAI 관리자 웹의 모든 API를 첨부된 양식에 맞춰 정리한 명세서입니다.
> 모든 API는 Bearer Token 인증이 필요하며, 백엔드 연동 준비가 완료되어 있습니다.
