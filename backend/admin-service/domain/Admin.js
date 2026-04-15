class Admin {
  constructor({ adminId, email, password, role, createdAt }) {
    this.adminId = adminId;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }
}

module.exports = { Admin };
