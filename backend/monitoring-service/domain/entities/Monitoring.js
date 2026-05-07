/**
 * Monitoring 도메인 엔티티들 한 번에 export (호환용)
 */
const { ServiceSnapshot, DomainError } = require("./ServiceSnapshot");
const { DiagnosisStat } = require("./DiagnosisStat");

module.exports = { ServiceSnapshot, DiagnosisStat, DomainError };
