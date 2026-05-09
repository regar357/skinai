/**
 * ═══════════════════════════════════════════════
 * Domain Error (도메인 계층 공통)
 * ═══════════════════════════════════════════════
 *
 * 역할: 비즈니스 규칙 위반 시 발생하는 에러
 * - 전역 에러 핸들러가 statusCode를 기반으로 응답 처리
 */
class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
  }
}

module.exports = DomainError;
