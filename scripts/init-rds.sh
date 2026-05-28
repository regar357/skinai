#!/bin/bash
# RDS 스키마 초기화 스크립트
# 최초 1회만 실행 — EC2에서 실행하세요
#
# 사전 조건: mysql-client 설치
#   sudo apt-get install -y mysql-client
#
# 실행:
#   bash scripts/init-rds.sh

set -e

ENV_FILE="${1:-.env.prod}"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌  $ENV_FILE 파일을 찾을 수 없습니다."
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

: "${DB_HOST:?DB_HOST가 설정되지 않았습니다}"
: "${DB_USER:?DB_USER가 설정되지 않았습니다}"
: "${DB_PASSWORD:?DB_PASSWORD가 설정되지 않았습니다}"

PORT="${DB_PORT:-3306}"
INIT_DIR="./docker/mysql-init"

echo "RDS 연결 확인 중: $DB_HOST:$PORT ..."
if ! mysql -h "$DB_HOST" -P "$PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &>/dev/null; then
  echo "❌  RDS 연결 실패. 호스트/자격증명/보안그룹 인바운드 규칙을 확인하세요."
  exit 1
fi

echo "✅  연결 성공. 스키마 초기화를 시작합니다..."

for sql_file in "$INIT_DIR"/*.sql; do
  echo "  → $(basename "$sql_file")"
  mysql -h "$DB_HOST" -P "$PORT" -u "$DB_USER" -p"$DB_PASSWORD" < "$sql_file"
done

echo "✅  스키마 초기화 완료."
