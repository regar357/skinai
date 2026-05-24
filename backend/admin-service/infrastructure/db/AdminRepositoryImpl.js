/**
 * ═══════════════════════════════════════════════
 * Admin Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 *
 * 다른 서비스 데이터베이스에 직접 쿼리하지 않고, 하나의
 * 통합 admin DB(혹은 view)를 통해 사용자/피드백/이미지/
 * 진단 정보를 조회한다고 가정한다. 실 운영 환경에서는
 * 각 서비스에 admin-only 내부 API 를 두거나 read-replica
 * 를 사용하는 것을 권장한다.
 *
 * 표(가정):
 *   - users          (user_id, name, email, status, created_at, last_login_at)
 *   - feedbacks      (feedback_id, user_id, rating, content, reply_text,
 *                     replied_at, created_at)
 *   - diagnoses      (diagnosis_id, user_id, image_id, status,
 *                     suspected_disease, ai_confidence, created_at)
 *   - images         (image_id, file_name, file_size, image_url,
 *                     uploaded_at)
 *   - dashboard_stats / model_info  (선택 - 통계 캐시)
 *
 * 실제 테이블이 없는 환경에서는 빈 배열/0 등 기본값을 반환한다.
 */
const AdminRepository = require("../../domain/interfaces/AdminRepository");

const safe = async (fn, fallback) => {
  try {
    return await fn();
  } catch (e) {
    console.warn("[admin-service] repository fallback:", e.code || e.message);
    return fallback;
  }
};

class AdminRepositoryImpl extends AdminRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  // ── 사용자 관리 ────────────────────────────
  async findUsers({ page = 1, limit = 10, status }) {
    return safe(
      async () => {
        const offset = (page - 1) * limit;
        const params = [];
        let where = "";
        if (status) {
          where = "WHERE status = ?";
          params.push(status);
        }
        const [rows] = await this.pool.execute(
          `SELECT user_id, name, email, status, created_at, last_login_at
           FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [...params, String(limit), String(offset)],
        );
        const [[cnt]] = await this.pool.query(
          `SELECT COUNT(*) AS total FROM users ${where}`,
          params,
        );
        return {
          data: rows,
          pagination: {
            page,
            limit,
            total: cnt.total,
            totalPages: Math.ceil(cnt.total / limit),
          },
        };
      },
      { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    );
  }

  async updateUserStatus(userId, status) {
    return safe(
      async () => {
        await this.pool.execute(
          "UPDATE users SET status = ?, updated_at = NOW() WHERE user_id = ?",
          [status, userId],
        );
        const [rows] = await this.pool.execute(
          "SELECT user_id, name, email, status FROM users WHERE user_id = ?",
          [userId],
        );
        return rows[0] || { user_id: Number(userId), status };
      },
      { user_id: Number(userId), status },
    );
  }

  // ── 피드백 관리 ────────────────────────────
  async findFeedbacks({ page = 1, limit = 10 }) {
    return safe(
      async () => {
        const offset = (page - 1) * limit;
        const [rows] = await this.pool.execute(
          `SELECT feedback_id, user_id, rating, content, reply_text, replied_at, created_at
           FROM feedbacks ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [String(limit), String(offset)],
        );
        const [[cnt]] = await this.pool.query(
          "SELECT COUNT(*) AS total FROM feedbacks",
        );
        return {
          data: rows,
          pagination: {
            page,
            limit,
            total: cnt.total,
            totalPages: Math.ceil(cnt.total / limit),
          },
        };
      },
      { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    );
  }

  async saveFeedbackReply(feedbackId, replyText) {
    return safe(
      async () => {
        await this.pool.execute(
          "UPDATE feedbacks SET reply_text = ?, replied_at = NOW() WHERE feedback_id = ?",
          [replyText, feedbackId],
        );
        const [rows] = await this.pool.execute(
          "SELECT * FROM feedbacks WHERE feedback_id = ?",
          [feedbackId],
        );
        return (
          rows[0] || { feedback_id: Number(feedbackId), reply_text: replyText }
        );
      },
      { feedback_id: Number(feedbackId), reply_text: replyText },
    );
  }

  // ── 분석/이미지 관리 ───────────────────────
  async findExamRecords({ page = 1, limit = 10, search }) {
    return safe(
      async () => {
        const offset = (page - 1) * limit;
        const params = [];
        let where = "";
        if (search) {
          where = "WHERE u.name LIKE ? OR u.email LIKE ?";
          params.push(`%${search}%`, `%${search}%`);
        }
        const [rows] = await this.pool.execute(
          `SELECT d.diagnosis_id, d.user_id, u.name AS user_name, u.email AS user_email,
                d.suspected_disease, d.ai_confidence, d.status, d.created_at
           FROM diagnoses d
      LEFT JOIN users u ON u.user_id = d.user_id
                ${where}
       ORDER BY d.created_at DESC LIMIT ? OFFSET ?`,
          [...params, String(limit), String(offset)],
        );
        const [[cnt]] = await this.pool.query(
          `SELECT COUNT(*) AS total FROM diagnoses d
      LEFT JOIN users u ON u.user_id = d.user_id ${where}`,
          params,
        );
        return {
          data: rows,
          pagination: {
            page,
            limit,
            total: cnt.total,
            totalPages: Math.ceil(cnt.total / limit),
          },
        };
      },
      { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    );
  }

  async findImageById(imageId) {
    return safe(async () => {
      const [rows] = await this.pool.execute(
        `SELECT image_id, file_name, file_size, image_url, uploaded_at
           FROM images WHERE image_id = ? LIMIT 1`,
        [imageId],
      );
      return rows[0] || null;
    }, null);
  }

  // ── 대시보드 ───────────────────────────────
  async getDashboardStats() {
    return safe(
      async () => {
        const [[users]] = await this.pool.query(
          `SELECT COUNT(*) AS totalUsers,
                SUM(status='active') AS activeUsers FROM users`,
        );
        const [[analyses]] = await this.pool.query(
          `SELECT COUNT(*) AS totalAnalyses,
                SUM(DATE(created_at)=CURDATE()) AS todayAnalyses FROM diagnoses`,
        );
        return {
          totalUsers: users.totalUsers || 0,
          activeUsers: users.activeUsers || 0,
          totalAnalyses: analyses.totalAnalyses || 0,
          todayAnalyses: analyses.todayAnalyses || 0,
        };
      },
      { totalUsers: 0, activeUsers: 0, totalAnalyses: 0, todayAnalyses: 0 },
    );
  }

  async getDiagnosisTrend() {
    return safe(async () => {
      const [rows] = await this.pool.query(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS value
           FROM diagnoses
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          GROUP BY month ORDER BY month`,
      );
      return rows;
    }, []);
  }

  async getDiseaseDistribution() {
    return safe(async () => {
      const [rows] = await this.pool.query(
        `SELECT suspected_disease AS name, COUNT(*) AS value
           FROM diagnoses WHERE suspected_disease IS NOT NULL
          GROUP BY suspected_disease ORDER BY value DESC`,
      );
      const total = rows.reduce((s, r) => s + Number(r.value), 0) || 1;
      return rows.map((r) => ({
        name: r.name,
        value: Number(r.value),
        percentage: Math.round((Number(r.value) / total) * 100),
      }));
    }, []);
  }

  async getUserTrend() {
    return safe(async () => {
      const [rows] = await this.pool.query(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                COUNT(*) AS new
           FROM users
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          GROUP BY month ORDER BY month`,
      );
      return rows.map((r) => ({
        month: r.month,
        new: Number(r.new),
        active: Number(r.new),
      }));
    }, []);
  }

  // ── AI 모니터링 (실 데이터 미수집 - stub) ──
  async getPerformanceMetrics() {
    return [];
  }

  async getDiseaseAccuracy() {
    return [];
  }

  async getSystemStatus() {
    return {
      averageResponseTime: 0,
      dailyRequests: 0,
      errorRate: 0,
      uptime: 0,
    };
  }

  async getModelInfo() {
    return {
      modelVersion: process.env.AI_MODEL_VERSION || "unknown",
      lastTrained: process.env.AI_MODEL_LAST_TRAINED || "unknown",
      dataset: process.env.AI_MODEL_DATASET || "unknown",
      architecture: process.env.AI_MODEL_ARCH || "YOLOv8",
      inputSize: process.env.AI_MODEL_INPUT_SIZE || "640x640",
      classes: process.env.AI_MODEL_CLASSES || "unknown",
    };
  }
}

module.exports = AdminRepositoryImpl;
