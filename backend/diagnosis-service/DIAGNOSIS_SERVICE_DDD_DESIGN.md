# diagnosis-service DDD 설계서

## 1. 목적

`diagnosis-service`는 SkinAI의 AI 분석 마이크로서비스로서 이미지 업로드, 이미지 분석 요청, 분석 결과 저장, 분석 결과 목록 조회, 상세 조회, 삭제를 담당한다.

AI 모델 추론 자체는 `ai/`의 FastAPI 서버가 수행하고, `diagnosis-service`는 사용자 요청, 이미지 저장소, 분석 결과 영속화, 조회 권한, 삭제 정책을 관리한다.

## 1.1. 구현 범위

이번 구현 범위는 `backend/diagnosis-service/` 폴더 내부로 제한한다.

수정 가능:

- `backend/diagnosis-service/` 내부 파일

수정 금지:

- `ai/` 폴더
- `frontend/` 폴더
- 다른 backend 마이크로서비스 폴더

AI 서버와 프론트엔드는 외부 시스템으로 취급한다. `diagnosis-service`는 정해진 HTTP API 계약을 통해서만 AI 서버와 통신하고, 프론트엔드 코드를 변경하지 않고도 동작하도록 `POST /diagnosis`, `GET /diagnosis/history` 계약을 구현한다.

토큰 검증은 API Gateway의 책임이며 이번 개발 범위가 아니다. `diagnosis-service`는 API Gateway에서 토큰 검증이 완료된 이후의 요청만 들어온다고 가정하고 개발한다. 따라서 JWT 검증 로직, 로그인 여부 판단, 토큰 재발급 처리는 구현하지 않는다.

## 1.2. 개발 스택

- Runtime: Node.js
- Web Framework: Express
- Language: JavaScript
- Architecture: DDD 레이어 구조
- Image Upload Parser: `multer`
- Database: MySQL (skinai_diagnosis)
- Development Image Storage: `backend/diagnosis-service/uploads/`
- Deployment Image Storage: Amazon S3 전환을 고려하되, 개발 단계 구현은 로컬 이미지 폴더 기반으로 진행한다.

개발 단계에서는 이미지 파일을 `backend/diagnosis-service/uploads/` 하위에 저장하고, Express static middleware로 `/uploads/...` URL을 제공한다. S3 업로드 구현은 당장 활성화하지 않고, `ImageStorage` 포트와 로컬 저장소 어댑터에 배포 단계 전환 지점을 주석으로 남긴다.

## 1.3. 데이터베이스

- **Database Name**: skinai_diagnosis (독립 MySQL DB)
- **Connection Pool**: `src/infrastructure/db/database.js`에서 관리
- **Tables**: `diagnosis_images`, `analysis_results`
- **스키마**: `src/infrastructure/db/schema.sql`에 정의 (USE skinai_diagnosis; 포함)
- **스키마 실행**: `mysql -u [DB_USER] -p < schema.sql` (자동으로 skinai_diagnosis 선택)
- **환경 변수**: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD로 연결 설정
- **개발 단계**: InMemory 저장소 사용 가능하며, 배포 단계에서 MySQL로 전환

## 2. 바운디드 컨텍스트

### 컨텍스트 이름

Diagnosis Context

### 책임

- 사용자가 업로드한 피부 이미지 메타데이터를 관리한다.
- 업로드된 이미지를 AI 서버에 분석 요청한다.
- AI 서버 응답을 분석 결과로 정규화해 저장한다.
- 사용자별 분석 결과 목록과 상세 정보를 제공한다.
- 분석 결과 삭제 시 결과와 이미지 삭제 상태를 일관되게 관리한다.

### 외부 컨텍스트

| 외부 컨텍스트           | 연동 목적                        | 연동 방식                                                                                           |
| ----------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| API Gateway             | 토큰 검증, 인증된 요청 전달      | 검증 완료 후 사용자 식별자를 헤더 또는 요청 컨텍스트로 전달한다고 가정. API Gateway는 수정하지 않음 |
| Auth/User Service       | 사용자 식별 정보의 원천          | 직접 토큰 검증을 호출하지 않고 API Gateway가 전달한 `userId`를 신뢰                                 |
| AI FastAPI Server       | YOLO 기반 이미지 추론            | HTTP multipart 이미지 전달. `ai/` 폴더는 수정하지 않음                                              |
| Frontend                | 이미지 분석/이력 조회 API 호출   | API 응답 계약만 맞춤. `frontend/` 폴더는 수정하지 않음                                              |
| Local Image Folder      | 개발 단계 원본 이미지 저장       | `backend/diagnosis-service/uploads/`에 저장                                                         |
| Object Storage(S3)      | 배포 단계 원본 이미지 저장       | 현재 구현하지 않고 전환 지점을 주석으로 남김                                                        |
| MySQL(skinai_diagnosis) | 이미지/분석 결과 메타데이터 저장 | 독립 DB. `src/infrastructure/db/database.js`에서 연결 풀 관리. 개발 단계는 in-memory DB 사용 가능   |

## 3. 도메인 모델

### Aggregate 1: DiagnosisImage

이미지 데이터의 생명주기를 담당하는 Aggregate Root.

#### 필드

| 필드             | 타입                   | 설명                                                                           |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------ |
| imageId          | bigint                 | 이미지 식별자                                                                  |
| userId           | bigint                 | 이미지 소유 사용자                                                             |
| originalFileName | varchar(255)           | 업로드 당시 파일명                                                             |
| contentType      | varchar(100)           | MIME 타입                                                                      |
| fileSize         | bigint                 | 바이트 단위 파일 크기                                                          |
| storageKey       | varchar(512)           | 로컬 파일 상대 경로. 배포 단계에서는 S3 object key로 전환 가능                 |
| fileUrl          | varchar(1000)          | 개발 단계 `/uploads/...` URL. 배포 단계에서는 S3 URL 또는 signed URL 기준 경로 |
| thumbnailUrl     | varchar(1000) nullable | 분석 이력 목록에 표시할 썸네일 URL                                             |
| checksum         | char(64)               | SHA-256 중복/무결성 검증값                                                     |
| status           | enum                   | `UPLOADED`, `ANALYZED`, `DELETED`                                              |
| createdAt        | datetime               | 생성 시각                                                                      |
| deletedAt        | datetime nullable      | 삭제 시각                                                                      |

#### 불변식

- 이미지는 반드시 소유 사용자 `userId`를 가진다.
- `contentType`은 `image/jpeg`, `image/png`, `image/webp` 중 하나여야 한다.
- `fileSize`는 1 byte 이상, 정책상 최대 크기 이하이어야 한다. 기본 최대 크기: 10MB.
- `DELETED` 상태의 이미지는 새 분석 요청에 사용할 수 없다.
- 실제 바이너리 파일은 DB에 저장하지 않는다. 개발 단계에서는 로컬 이미지 폴더에 저장하고, 배포 단계에서는 S3로 교체할 수 있도록 저장소 포트를 분리한다.

### Aggregate 2: AnalysisResult

분석 결과 데이터의 생명주기를 담당하는 Aggregate Root.

#### 필드

| 필드             | 타입                  | 설명                                                        |
| ---------------- | --------------------- | ----------------------------------------------------------- |
| analysisId       | bigint                | 분석 결과 식별자                                            |
| imageId          | bigint                | 분석한 이미지 식별자                                        |
| userId           | bigint                | 결과 소유 사용자                                            |
| status           | enum                  | `REQUESTED`, `PROCESSING`, `COMPLETED`, `FAILED`, `DELETED` |
| resultStatus     | enum nullable         | `NORMAL`, `ABNORMAL`                                        |
| suspectedDisease | varchar(255) nullable | 의심 질환명                                                 |
| confidenceScore  | decimal(5,4) nullable | 0.0000-1.0000 신뢰도                                        |
| guideText        | text nullable         | 사용자 안내 문구                                            |
| rawResultJson    | json nullable         | AI 서버 원본 응답 보관                                      |
| errorMessage     | text nullable         | 실패 사유                                                   |
| analyzedAt       | datetime nullable     | 분석 완료 시각                                              |
| createdAt        | datetime              | 생성 시각                                                   |
| deletedAt        | datetime nullable     | 삭제 시각                                                   |

#### 불변식

- 분석 결과는 반드시 하나의 `DiagnosisImage`를 참조한다.
- 분석 결과의 `userId`는 참조 이미지의 `userId`와 같아야 한다.
- `COMPLETED` 상태에서는 `resultStatus`, `confidenceScore`, `guideText`, `analyzedAt`이 반드시 존재한다.
- `confidenceScore`는 0 이상 1 이하이다.
- `FAILED` 상태에서는 `errorMessage`가 반드시 존재한다.
- `DELETED` 상태의 결과는 일반 목록/상세 조회에서 제외한다.

## 4. 유스케이스

공통 전제:

- 모든 유스케이스는 API Gateway에서 토큰 검증이 완료된 요청을 받는다고 가정한다.
- `diagnosis-service`는 인증 토큰을 직접 검증하지 않는다.
- 사용자 식별자는 API Gateway가 전달한 `userId`를 사용한다.

### UC-01 이미지 업로드

입력: 인증 사용자, 이미지 파일

흐름:

1. 파일 타입과 크기를 검증한다.
2. checksum을 계산한다.
3. 개발 단계에서는 로컬 이미지 폴더에 이미지를 저장한다.
4. `DiagnosisImage`를 `UPLOADED` 상태로 저장한다.
5. 이미지 메타데이터를 반환한다.

출력:

```json
{
  "image_id": 1,
  "user_id": 10,
  "file_url": "/uploads/diagnosis/1.jpg",
  "file_name": "skin.jpg",
  "file_size": 204800,
  "created_at": "2026-05-04T10:00:00Z"
}
```

### UC-02 이미지 분석 API

입력: 인증 사용자, multipart/form-data 요청 바디의 `image` 파일

흐름:

1. 요청 바디에서 `image` 이름의 이미지 파일을 받는다.
2. 파일 타입과 크기를 검증한다.
3. 이미지 저장소에 파일을 저장하고 접근 가능한 `imageUrl`을 생성한다.
4. `DiagnosisImage`를 `UPLOADED` 상태로 저장한다.
5. `AnalysisResult`를 `PROCESSING` 상태로 생성하고 진단 고유 ID를 확보한다.
6. 원본 이미지 파일 또는 저장된 이미지 접근 정보를 AI FastAPI 서버에 전달한다.
7. AI 서버의 분석 결과에서 의심 질환명과 진단 확률을 받는다.
8. 분석 결과를 `COMPLETED` 상태로 저장하고 이미지 상태를 `ANALYZED`로 변경한다.
9. 진단 고유 ID, 저장된 이미지 URL, 의심 질환명, 진단 확률을 `body`에 담아 응답한다.

출력:

```json
{
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

### UC-03 업로드와 분석을 한 번에 수행

`POST /diagnosis`는 이미지 업로드, 이미지 URL 저장, AI 분석, 분석 결과 저장, 응답 생성을 하나의 애플리케이션 유스케이스로 처리한다.

흐름:

1. UC-01 이미지 업로드 절차를 내부적으로 수행한다.
2. AI 서버에 이미지 분석을 요청한다.
3. AI 응답을 `AnalysisResult`에 저장한다.
4. API 응답 형식에 맞춰 `body.diagnosisId`, `body.imageUrl`, `body.result.suspectedDisease`, `body.result.probability`를 반환한다.

### UC-04 분석 결과 목록 조회

입력: 인증 사용자, 요청 바디의 `page`, `size`

규칙:

- 기본적으로 요청 사용자 본인의 결과만 조회한다.
- 관리자 권한은 별도 정책 객체에서 허용한다.
- `DELETED` 상태는 제외한다.
- 최신순 정렬을 기본으로 한다.
- `page`는 1 이상의 페이지 번호이다.
- `size`는 페이지당 데이터 수이며 기본값은 10, 최대값은 50으로 제한한다.
- 응답에는 분석 이력 목록과 페이지 메타데이터를 함께 포함한다.
- `GET` 요청 바디는 일부 클라이언트/프록시에서 제한될 수 있으므로 구현 시 body parser와 API Gateway 전달 설정을 확인한다.

출력:

```json
{
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

### UC-05 분석 결과 상세 조회

입력: 인증 사용자, analysisId

규칙:

- 결과가 존재해야 한다.
- 삭제된 결과는 404로 처리한다.
- 사용자 본인 소유 또는 관리자만 조회할 수 있다.
- 이미지 메타데이터를 함께 반환한다.

### UC-06 분석 결과 삭제

입력: 인증 사용자, analysisId

규칙:

- 결과 소유자 또는 관리자만 삭제할 수 있다.
- 분석 결과는 soft delete한다.
- 이미지가 다른 활성 분석 결과에서 참조되지 않으면 이미지도 soft delete하고 로컬 이미지 파일 삭제를 수행한다.
- 로컬 이미지 삭제 실패는 DB 트랜잭션을 롤백하지 않고 재시도 또는 보상 작업 대상으로 기록한다.
- 배포 단계에서 S3로 전환할 때는 같은 `ImageStorage` 포트 뒤에 S3 어댑터를 추가한다는 주석을 남긴다.

## 5. 애플리케이션

application 레이어는 비즈니스 로직만 작성한다. 라우팅, 업로드 파싱, 에러 미들웨어, DB 설정, AI HTTP 통신 코드는 application에 두지 않는다. application은 domain의 엔티티와 인터페이스에 의존하고, 실제 구현체는 infrastructure에서 주입받는다.

| 파일                                  | 메서드             | 책임                         |
| ------------------------------------- | ------------------ | ---------------------------- |
| `src/application/diagnosisService.js` | `analyze(command)` | 이미지 분석 비즈니스 흐름    |
| `src/application/diagnosisService.js` | `history(query)`   | 분석 이력 조회 비즈니스 흐름 |
| `src/application/diagnosisService.js` | `detail(query)`    | 분석 상세 조회 비즈니스 흐름 |
| `src/application/diagnosisService.js` | `remove(command)`  | 분석 결과 삭제 비즈니스 흐름 |

Command/Query 예시:

```javascript
const uploadImageCommand = {
  userId: 1,
  file: uploadedFile,
};

const analyzeImageCommand = {
  userId: 1,
  image: uploadedFile,
};

const listAnalysisResultsQuery = {
  userId: 1,
  page: 1,
  size: 10,
  role: "USER",
};
```

## 6. 레이어 구조

코드는 과한 추상화 없이 다음 구조로 제한한다. 라우트와 컨트롤러는 `interface` 폴더에 통합하고, domain에는 필요한 데이터 모델과 인터페이스만 둔다.

- **interface**: 라우터, 컨트롤러를 정의한다.
- **domain**: 데이터 모델, 데이터 모델 접근 추상화를 정의한다.
- **infrastructure**: DB설정, 스키마, 미들웨어, 데이터 모델 접근 구체화를 구현한다.
- **application**: 비즈니스 로직을 구현한다.

```text
backend/diagnosis-service/
  package.json
  src/
    app.js
    server.js
    interface/
      router.js
      controller.js
    application/
      diagnosisService.js
    domain/
      models/
        DiagnosisImage.js
        AnalysisResult.js
      interfaces/
        ImageRepository.js
        AnalysisRepository.js
        ImageStorage.js
        AiDiagnosisClient.js
      shared/
        error.js
    infrastructure/
      db/
        inMemoryStore.js
        InMemoryImageRepository.js
        InMemoryAnalysisRepository.js
        schema.sql
        database.js
      middleware/
        uploadMiddleware.js
        LocalImageStorage.js
        errorHandler.js
      ai-client/
        FastApiDiagnosisClient.js
  uploads/
    # 개발 단계 이미지 저장 폴더
```

역할:

```text
interface/router.js -> interface/controller.js
interface/controller.js -> application
application -> domain models + domain interfaces
infrastructure -> domain interfaces 구현체, db 설정, db schema, middleware, ai-client
```

## 6. Interface 구성

```javascript
// src/interface/router.js
// Express 라우터 정의. 컨트롤러를 주입받아 라우팅.

// src/interface/controller.js
// HTTP 요청/응답 처리. application 서비스를 호출하고 응답 포맷팅.
```

## 7. Infrastructure 구성

```javascript
// src/infrastructure/db/inMemoryStore.js
// 개발 단계 테스트용 저장소.

// src/infrastructure/db/InMemoryImageRepository.js
// domain/interfaces/ImageRepository.js 구현체.

// src/infrastructure/db/InMemoryAnalysisRepository.js
// domain/interfaces/AnalysisRepository.js 구현체.

// src/infrastructure/db/schema.sql
// diagnosis_images, analysis_results 테이블 스키마.
// 데이터베이스 선택: USE skinai_diagnosis; 포함.
// 실행 방법: mysql -u [DB_USER] -p [DB_PASSWORD] < schema.sql

// src/infrastructure/db/database.js
// MySQL 연결 풀 설정. skinai_diagnosis 데이터베이스에 접속.
// 환경 변수: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD로 커넥션 설정.
// initializeDatabase()로 연결 상태 확인 가능.

// src/infrastructure/middleware/uploadMiddleware.js
// multer 기반 이미지 업로드 미들웨어.
// 개발 단계는 uploads 폴더에 저장한다.
// 배포 단계에서는 이 지점을 S3 업로드 미들웨어 또는 S3 storage adapter로 교체한다.

// src/infrastructure/middleware/LocalImageStorage.js
// domain/interfaces/ImageStorage.js 구현체.

// src/infrastructure/middleware/errorHandler.js
// Express 에러 응답 변환 미들웨어.

// src/infrastructure/ai-client/FastApiDiagnosisClient.js
// domain/interfaces/AiDiagnosisClient.js 구현체. /predict 경로로 이미지 파일을 전송하고 분석 결과를 받아 정규화.
```

## 8. API 설계

핵심 분석 API는 `POST /diagnosis`이다. 요청 바디의 `image` 파일을 받아 이미지 URL을 생성/저장하고, AI 서버 분석 결과를 저장한 뒤 필요한 필드만 응답한다.

### Diagnosis

| Method | Path                 | Content-Type          | 설명                                         |
| ------ | -------------------- | --------------------- | -------------------------------------------- |
| POST   | `/diagnosis`         | `multipart/form-data` | 이미지 업로드, AI 분석, 결과 저장, 최종 응답 |
| GET    | `/diagnosis/history` | `application/json`    | 분석 결과 이력 페이지 조회                   |

#### Request

| 필드  | 위치      | 타입 | 필수 | 설명               |
| ----- | --------- | ---- | ---- | ------------------ |
| image | form-data | File | Yes  | 분석할 이미지 파일 |

#### Response

```json
{
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

응답 필드 매핑:

| 응답 필드                    | 출처                                              |
| ---------------------------- | ------------------------------------------------- |
| body.diagnosisId             | `analysis_results.analysis_id`                    |
| body.imageUrl                | `diagnosis_images.file_url`                       |
| body.result.suspectedDisease | AI 서버 응답의 의심 질환명                        |
| body.result.probability      | AI 서버 응답의 진단 확률을 0-100 정수 점수로 변환 |

#### History Request

`GET /diagnosis/history`는 요청 바디에 페이지 정보를 담아 보낸다.

```json
{
  "page": 1,
  "size": 10
}
```

| 필드 | 위치 | 타입   | 필수 | 설명                    |
| ---- | ---- | ------ | ---- | ----------------------- |
| page | body | number | Yes  | 페이지 번호, 1부터 시작 |
| size | body | number | Yes  | 페이지당 데이터 수      |

#### History Response

```json
{
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

응답 필드 매핑:

| 응답 필드                   | 출처                                                            |
| --------------------------- | --------------------------------------------------------------- |
| body.items[].id             | `analysis_results.analysis_id`                                  |
| body.items[].date           | `analysis_results.analyzed_at`을 `YYYY.MM.DD` 형식으로 변환     |
| body.items[].result         | `analysis_results.suspected_disease`                            |
| body.items[].score          | `analysis_results.confidence_score`를 0-100 정수 점수로 변환    |
| body.items[].thumbnail      | `diagnosis_images.thumbnail_url` 또는 썸네일 생성 규칙 기반 URL |
| body.pagination.currentPage | 요청 바디의 `page`                                              |
| body.pagination.totalPages  | `ceil(totalItems / size)`                                       |
| body.pagination.totalItems  | 삭제되지 않은 사용자 분석 결과 총 개수                          |
| body.pagination.hasNext     | `currentPage < totalPages`                                      |
| body.pagination.hasPrev     | `currentPage > 1`                                               |

### 기존 관리 API

### Images

| Method | Path                        | 설명                    |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/images`               | 이미지 업로드           |
| GET    | `/api/images/{imageId}`     | 이미지 상세 조회        |
| GET    | `/api/images/user/{userId}` | 사용자 이미지 목록 조회 |
| DELETE | `/api/images/{imageId}`     | 이미지 삭제             |

### Analysis

| Method | Path                                          | 설명                            |
| ------ | --------------------------------------------- | ------------------------------- |
| POST   | `/api/analysis`                               | 기존 이미지에 대한 AI 분석 요청 |
| GET    | `/api/analysis?page=1&limit=10`               | 분석 결과 목록 조회             |
| GET    | `/api/analysis/user/{userId}?page=1&limit=10` | 사용자 분석 결과 목록 조회      |
| GET    | `/api/analysis/{analysisId}`                  | 분석 결과 상세 조회             |
| DELETE | `/api/analysis/{analysisId}`                  | 분석 결과 삭제                  |

## 9. DB 설계

### diagnosis_images

```sql
CREATE TABLE diagnosis_images (
  image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  original_file_name VARCHAR(255) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_key VARCHAR(512) NOT NULL UNIQUE,
  file_url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000) NULL,
  checksum CHAR(64) NOT NULL,
  status ENUM('UPLOADED', 'ANALYZED', 'DELETED') NOT NULL DEFAULT 'UPLOADED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_diagnosis_images_user_created (user_id, created_at DESC),
  INDEX idx_diagnosis_images_status (status)
);
```

### analysis_results

```sql
CREATE TABLE analysis_results (
  analysis_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  image_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  status ENUM('REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED', 'DELETED') NOT NULL,
  result_status ENUM('NORMAL', 'ABNORMAL') NULL,
  suspected_disease VARCHAR(255) NULL,
  confidence_score DECIMAL(5,4) NULL,
  guide_text TEXT NULL,
  raw_result_json JSON NULL,
  error_message TEXT NULL,
  analyzed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_analysis_results_image
    FOREIGN KEY (image_id) REFERENCES diagnosis_images(image_id),
  INDEX idx_analysis_results_user_created (user_id, created_at DESC),
  INDEX idx_analysis_results_image (image_id),
  INDEX idx_analysis_results_status (status)
);
```

## 10. 트랜잭션 정책

- DB 메타데이터 저장과 상태 변경은 하나의 트랜잭션으로 묶는다.
- 개발 단계 로컬 이미지 저장은 DB 저장 전에 수행하고, DB 저장 실패 시 로컬 파일 삭제 보상 작업을 수행한다.
- 배포 단계 S3 전환 시에도 동일한 순서를 유지하며, S3 삭제 보상 작업이 필요하다는 주석을 저장소 어댑터에 남긴다.
- AI 서버 호출은 긴 I/O이므로 DB 트랜잭션 밖에서 수행한다.
- 분석 생성은 `PROCESSING` 저장 후 AI 호출, 이후 결과 업데이트 순서로 진행한다.
- AI 호출 실패 시 분석 결과를 `FAILED`로 저장해 사용자가 실패 이력을 확인할 수 있게 한다.

## 11. 오류 정책

| 상황                    | HTTP Status | 도메인 오류                |
| ----------------------- | ----------- | -------------------------- |
| 지원하지 않는 파일 형식 | 400         | `UnsupportedImageType`     |
| 파일 크기 초과          | 413         | `ImageTooLarge`            |
| 이미지 없음             | 404         | `ImageNotFound`            |
| 분석 결과 없음          | 404         | `AnalysisResultNotFound`   |
| 소유자 불일치           | 403         | `ForbiddenDiagnosisAccess` |
| 삭제된 리소스 접근      | 404         | `ResourceNotFound`         |
| AI 서버 오류            | 502         | `AiDiagnosisFailed`        |

## 12. 설계 검증 테스트

### 테스트 기준

| ID   | 검증 항목                                          | 기대 결과                                                                                                          | 결과 |
| ---- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---- |
| T-01 | 요구 기능 6개가 모두 유스케이스에 매핑되는가       | 업로드, 분석, 저장, 목록, 상세, 삭제가 존재                                                                        | PASS |
| T-02 | 필요한 데이터가 누락되지 않았는가                  | 이미지 데이터, 분석 결과 데이터가 설계와 스키마에 존재                                                             | PASS |
| T-03 | 레이어 책임이 명확한가                             | interface는 라우트/컨트롤러, domain은 모델/인터페이스, application은 비즈니스 로직, infrastructure는 구현체를 담당 | PASS |
| T-04 | 이미지와 분석 결과의 소유권 불변식이 있는가        | `image.userId == analysis.userId` 규칙 존재                                                                        | PASS |
| T-05 | 분석 완료 데이터의 필수값이 정의됐는가             | 상태, 신뢰도, 가이드, 완료 시각 규칙 존재                                                                          | PASS |
| T-06 | 삭제 정책이 데이터와 파일 저장소를 모두 고려하는가 | soft delete + storage 삭제 보상 작업 존재                                                                          | PASS |
| T-07 | 신규 이미지 분석 API 계약이 명확한가               | `POST /diagnosis`가 `image` 파일을 받고 `body` 래퍼 안에 진단 결과를 반환                                          | PASS |
| T-08 | AI 서버 장애 시 결과 저장 규칙이 있는가            | `FAILED` 상태와 `errorMessage` 저장                                                                                | PASS |
| T-09 | 분석 이력 조회 API 계약이 명확한가                 | `GET /diagnosis/history`가 page/size를 받고 이력 목록과 페이지 메타데이터를 반환                                   | PASS |
| T-10 | MySQL 스키마가 조회 패턴을 지원하는가              | user/created, image, status 인덱스와 thumbnail_url 존재                                                            | PASS |
| T-11 | 구현 범위가 명확히 제한되는가                      | `backend/diagnosis-service/` 내부만 수정하고 `ai/`, `frontend/`는 외부 시스템으로 취급                             | PASS |
| T-12 | 개발 스택과 저장소 전략이 명확한가                 | Node.js + Express + JavaScript, 개발 로컬 이미지 폴더, 배포 S3 전환 주석 방침 존재                                 | PASS |
| T-13 | 인증 책임 경계가 명확한가                          | 토큰 검증은 API Gateway 완료 후로 가정하고 diagnosis-service는 직접 JWT 검증을 구현하지 않음                       | PASS |

### 테스트 결과

모든 설계 검증 항목이 통과했다.

```text
Design validation: 13 passed, 0 failed
```

## 13. 구현 전 확정 사항

- 기본 이미지 최대 크기: 10MB
- 허용 MIME 타입: `image/jpeg`, `image/png`, `image/webp`
- 개발 스택: Node.js + Express + JavaScript
- 이미지 업로드 처리: `multer`
- 개발 단계 이미지 저장: `backend/diagnosis-service/uploads/`
- 배포 단계 이미지 저장: S3 사용을 염두에 두되 현재 구현은 로컬 이미지 폴더 기반으로 하며, S3 전환 지점은 코드 주석으로 남긴다.
- 삭제 방식: DB soft delete, 로컬 이미지 파일 삭제는 보상 작업
- 분석 실행 방식: `POST /diagnosis` 요청 안에서 동기 HTTP 호출로 AI 서버 분석 결과를 받아온다.
- 이미지 분석 API 계약: `multipart/form-data`의 `image` 파일을 입력으로 받고 `body.diagnosisId`, `body.imageUrl`, `body.result.suspectedDisease`, `body.result.probability`를 응답한다.
- 분석 이력 조회 API 계약: `GET /diagnosis/history` 요청 바디의 `page`, `size`를 입력으로 받고 이력 목록과 페이지 메타데이터를 응답한다.
- 구현 범위: `backend/diagnosis-service/` 폴더 내부만 수정하며 `ai/`, `frontend/`, 다른 backend 서비스 폴더는 수정하지 않는다.
- 인증 전제: 토큰 검증은 API Gateway에서 완료된 것으로 가정하고, `diagnosis-service`는 전달받은 `userId`를 사용한다.
