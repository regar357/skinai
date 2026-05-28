# SkinAI 로컬 실행 가이드 (화면 테스트용)

## 사전 요구사항

- **Docker Desktop** 설치 및 실행 중
- 포트 3000, 3001, 3010, 3306, 8001 사용 가능

## 실행 (한 줄)

네이버 병원 검색을 사용하려면 실행 전에 루트 `.env`에 네이버 개발자센터 검색 API 키를 넣습니다.

```env
NAVER_SEARCH_CLIENT_ID=발급받은_Client_ID
NAVER_SEARCH_CLIENT_SECRET=발급받은_Client_Secret
NAVER_HOSPITAL_SEARCH_KEYWORD=피부과
NAVER_HOSPITAL_SEARCH_DISPLAY=5
```

`docker compose up`으로 실행하면 루트 `.env`를 읽습니다. `backend/hospital-service`만 단독으로
실행할 때는 `backend/hospital-service/.env`에 같은 값을 넣습니다.

```bash
docker compose up --build
```

처음 실행은 의존성 설치 + DB 초기화 때문에 5~10분 정도 걸립니다.
다음부터는 1분 내로 뜹니다.

전부 뜨면 다음 로그가 보입니다:
```
skinai-api-gateway   | [api-gateway] running on port 3001
skinai-mobileweb     | ✓ Ready in ...
skinai-admin-web     | ✓ Ready in ...
```

## 접속

| 서비스 | URL | 용도 |
|--------|-----|------|
| **모바일 웹** | http://localhost:3000 | 사용자 화면 (로그인/진단) |
| **관리자 웹** | http://localhost:3010 | 관리자 화면 |
| API Gateway | http://localhost:3001/api/v1 | API 호출 진입점 |
| MySQL | localhost:3306 | root / 1234 |

## 화면 테스트 시나리오

### 1) 모바일 웹 (http://localhost:3000)
1. **회원가입** — `/auth/signup` 호출 확인 (브라우저 개발자도구 Network 탭)
2. **로그인** — `accessToken`, `refreshToken`, `user` 응답 받는지 확인
3. **진단 이력** — `/diagnoses/history` 호출
4. **공지사항** — `/notices` 호출 (DB가 비어있어 빈 리스트 정상)
5. **피부백과** — `/encyclopedia` 호출
6. **주변 병원** — `/hospitals/nearby?lat=...&lng=...` 호출
7. **피드백 작성/내 피드백** — `/feedback`, `/feedback/my`

### 2) 관리자 웹 (http://localhost:3010)
1. **관리자 로그인** — 이메일이 `admin` 으로 시작해야 관리자로 등록됨
   예: `admin@test.com` / `password123`
   먼저 모바일 웹에서 위 이메일로 회원가입 후 관리자 웹에서 로그인
2. **사용자 관리** — `/admin/users`
3. **대시보드** — `/admin/dashboard/stats`
4. **공지사항 관리** — `/admin/notices`

## DB 직접 보기

```bash
docker exec -it skinai-mysql mysql -uroot -p1234

mysql> SHOW DATABASES;
# skinai_auth, skinai_user, skinai_diagnosis, skinai_content, ... 8개 보여야 함

mysql> USE skinai_auth;
mysql> SELECT * FROM auth_credentials;
```

## 자주 겪는 문제

### "Cannot connect to MySQL"
첫 실행 시 MySQL 초기화가 늦어 서비스가 먼저 죽는 경우. `depends_on.condition: service_healthy`
설정으로 막아뒀지만 그래도 안 되면:
```bash
docker compose down
docker compose up --build
```

### "회원가입은 되는데 관리자 로그인은 안 됨"
관리자 권한은 **이메일이 `admin` 으로 시작**할 때만 부여됩니다 (auth-service 의 임시 로직).
`admin@test.com` 같은 이메일로 가입하세요.

### "Network 탭에 CORS 에러"
백엔드는 모두 `cors()` 미들웨어가 켜져 있습니다. 브라우저가 `localhost:3001`로 요청 보내고
있는지 확인하세요. NEXT_PUBLIC_API_BASE_URL은 docker-compose 에서 자동 주입됩니다.

### "Disease/통계 화면이 비어있음"
DB가 비어있어서 정상입니다. `safe()` fallback으로 빈 배열을 반환합니다.
실제 데이터를 보려면 모바일 웹에서 진단/피드백을 직접 만들거나 시드 데이터 SQL을
`docker/mysql-init/` 에 추가하면 됩니다.

### 컨테이너 다시 시작
```bash
docker compose restart auth-service     # 특정 서비스만
docker compose down -v                  # DB까지 완전 초기화
docker compose up --build
```

### 로그 보기
```bash
docker compose logs -f api-gateway      # 게이트웨이 로그
docker compose logs -f auth-service     # 특정 서비스
docker compose logs                     # 전체
```

## 네트워크 흐름 (참고)

```
브라우저 (localhost:3000)
   ↓ fetch("/api/v1/auth/signup", ...)
   ↓ NEXT_PUBLIC_API_BASE_URL = http://localhost:3001/api/v1
api-gateway (localhost:3001)
   ↓ proxy
auth-service (auth-service:3002)
   ↓
mysql (mysql:3306)
```

## 종료

```bash
docker compose down       # 컨테이너만 종료 (DB 볼륨 유지)
docker compose down -v    # DB 볼륨까지 삭제 (완전 초기화)
```
