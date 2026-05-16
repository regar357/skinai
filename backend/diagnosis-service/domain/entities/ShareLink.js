/**
 * ═══════════════════════════════════════════════
 * ShareLink Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: ShareLink 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 ShareLinkModel에 위치 (이 클래스는 그것을 상속받음)
 */
const ShareLinkModel = require("../models/ShareLinkModel");
const DomainError = require("./DomainError");

class ShareLink extends ShareLinkModel {
  isExpired() {
    if (!this.expires_at) return false;
    return new Date() > new Date(this.expires_at);
  }

  deactivate() {
    this.is_active = false;
  }
}

module.exports = { ShareLink, DomainError };
