/**
 * ═══════════════════════════════════════════════
 * Admin Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Admin 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 AdminModel에 위치 (이 클래스는 그것을 상속받음)
 */
const AdminModel = require("../models/AdminModel");
const DomainError = require("./DomainError");

class Admin extends AdminModel {
  hasPermission(perm) {
    return this.permissions.includes(perm) || this.permissions.includes("all");
  }
}

module.exports = { Admin, DomainError };
