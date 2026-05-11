# SkinAI API 문서 (추가)

---

## 1. 진단 이력 삭제 API

### 진단 삭제 API

## API 개요

### 기본 정보
- **API 이름**: Delete Diagnosis
- **엔드포인트**: `/diagnoses/{id}`
- **메서드**: DELETE
- **설명**: 특정 진단 기록을 삭제합니다.

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | IN | Integer | Yes | 삭제할 진단 기록 ID |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "DELETE",
  "url": "/api/v1/diagnoses/123",
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
    "success": true,
    "message": "진단 기록이 삭제되었습니다."
  }
}
```

---

## 2. 진단 상세 조회 API

### 진단 상세 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Diagnosis Detail
- **엔드포인트**: `/diagnoses/{id}`
- **메서드**: GET
- **설명**: 특정 진단 기록의 상세 정보를 조회합니다. (클릭 시 나오는 상세창)

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | IN | Integer | Yes | 조회할 진단 기록 ID |
| id | OUT | Integer | - | 진단 고유 ID |
| imageUrl | OUT | String | - | 진단 이미지 URL |
| testDate | OUT | String | - | 검사일자 (YYYY.MM.DD) |
| diseaseName | OUT | String | - | 의심질환명 |
| probability | OUT | Integer | - | 확률 (0-100) |
| createdAt | OUT | String | - | 생성 일시 (ISO 8601) |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/diagnoses/123",
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
    "success": true,
    "data": {
      "id": 123,
      "imageUrl": "/uploads/diagnosis_123.jpg",
      "testDate": "2026.05.11",
      "diseaseName": "기저세포암",
      "probability": 78,
      "createdAt": "2026-05-11T10:30:00Z"
    }
  }
}
```

---

## 3. 로그아웃 API

### 로그아웃 API

## API 개요

### 기본 정보
- **API 이름**: Logout
- **엔드포인트**: `/auth/logout`
- **메서드**: POST
- **설명**: 사용자를 로그아웃 처리하고 토큰을 무효화합니다.

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| (없음) | - | - | - | 인증 토큰만 필요 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "POST",
  "url": "/api/v1/auth/logout",
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
    "success": true,
    "message": "로그아웃 되었습니다."
  }
}
```

---

## 4. 백과사전 상세 조회 API

### 백과사전 상세 조회 API

## API 개요

### 기본 정보
- **API 이름**: Get Encyclopedia Detail
- **엔드포인트**: `/content/encyclopedia/{id}`
- **메서드**: GET
- **설명**: 특정 백과사전 항목의 상세 정보를 조회합니다. (클릭 시 나오는 상세창)

---

## 파라미터 상세

| 파라미터명 | 전송방향 | 타입 | 필수여부 | 설명 |
|-----------|----------|------|----------|------|
| id | IN | Integer | Yes | 조회할 백과사전 항목 ID |
| id | OUT | Integer | - | 항목 고유 ID |
| title | OUT | String | - | 제목 |
| content | OUT | String | - | 내용 |

---

## 실제 전송 내용

### 요청 (Request)
```json
{
  "method": "GET",
  "url": "/api/v1/content/encyclopedia/45",
  "headers": {
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
    "success": true,
    "data": {
      "id": 45,
      "title": "기저세포암",
      "content": "기저세포암은 피부에서 가장 흔한 악성 종양입니다. 주로 얼굴, 목, 손 등 햇빛에 노출되는 부위에 발생합니다..."
    }
  }
}
```


---

## 5. 병원 상세 조회 API

병원 리스트에 병원 정보들이 뜹니다 클릭했을때 따로 나오는 창은 없습니다. 따라서 상세조회api도 딱히 필요없을 듯 합니다.
대신 지금 프론트에 병원리스트에 각각 병원 정보가 나오고 그 밑에 전화하기/길찾기 버튼이 있는데
그에 맞게 전화하기api(구현어려울시 삭제)와 지도api들을 정리하면 될것같습니다.


---

> 마지막 업데이트: 2026-05-11
> 
> 본 문서는 SkinAI 앱의 추가 API 요청사항을 첨부된 양식에 맞춰 정리한 명세서입니다.
