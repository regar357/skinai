/**
 * ═══════════════════════════════════════════════
 * Notice Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Notice 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 NoticeModel에 위치 (이 클래스는 그것을 상속받음)
 */
const NoticeModel = require("../models/NoticeModel");
const DomainError = require("./DomainError");

class Notice extends NoticeModel {
  static validateRequired({ title, content }) {
    if (!title || !content) throw new DomainError("제목과 내용은 필수입니다.");
  }
}

module.exports = { Notice, DomainError };
