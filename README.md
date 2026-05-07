# 졸업 프로젝트

이 프로젝트는 Next.js 프론트엔드, Node.js Express 백엔드, Python FastAPI AI 서버를 포함한 풀스택 애플리케이션입니다. AI 파트는 PyTorch와 Ultralytics YOLO를 사용합니다. 배포는 AWS를 고려하여 Docker로 구성되었습니다.

## 구조

- `frontend/`: Next.js 애플리케이션
- `backend/`: Node.js Express 서버
- `ai/`: Python FastAPI AI 서버 (YOLO 모델)
- `nginx/`: Nginx 설정
- `docker/`: Dockerfiles

## 서비스 구조 (9개 서비스)

| # | 서비스 | 포트 | 기능 |
|---|--------|------|------|
| - | API Gateway | 3001 | 요청 라우팅 |
| 1 | 인증 서비스 | 3002 | 토큰 생성, 사용자/관리자 인증 |
| 2 | 사용자 서비스 | 3003 | 사용자 정보, 탈퇴 |
| 3 | 분석 서비스(diagnosis) | 3004 | 이미지 업로드(S3), 분석 수행, 결과 CRUD, 공유 링크, 로그 |
| 4 | 콘텐츠 서비스 | 3005 | 피부백과 CRUD, 공지사항 CRUD |
| 5 | 병원 탐색 서비스 | 3006 | 병원 탐색(네이버 지도 API), 상세 조회 |
| 6 | 피드백 서비스 | 3007 | 피드백 CRUD, 답변 작성 |
| 7 | 관리자 서비스 | 3008 | 서비스 통신(내부 API) |
| 8 | 모니터링-대시보드 | 3009 | AI 진단 모니터링, 대시보드 |
| 9 | AI 진단 서버 | 8001 | 이미지 수신, AI 분석, 결과 전달 |

## 로컬 개발

1. 각 서비스의 의존성 설치:
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
   - AI: `cd ai && pip install -r requirements.txt`

2. 서비스 실행:
   - Frontend: `cd frontend && npm run dev`
   - Backend: `cd backend && npm run dev`
   - AI: `cd ai && uvicorn main:app --reload`

3. 또는 Docker Compose 사용:
   `docker-compose up --build`

## 배포

AWS에 배포 시, 각 서비스를 컨테이너화하여 ECS나 EKS에 배포. Nginx를 로드 밸런서로 사용.

## AI 모델

YOLO 모델은 로컬에서 학습 후, `ai/` 폴더에 배치하여 사용.