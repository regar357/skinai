class MonitoringController {
  constructor(service) {
    this.service = service;
  }

  getPerformanceMetrics = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getPerformanceMetrics() });
    } catch (e) {
      next(e);
    }
  };

  getDiseaseAccuracy = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getDiseaseAccuracy() });
    } catch (e) {
      next(e);
    }
  };

  getSystemStatus = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getSystemStatus() });
    } catch (e) {
      next(e);
    }
  };

  getModelInfo = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getModelInfo() });
    } catch (e) {
      next(e);
    }
  };

  // ── 대시보드 ───────────────────────────────
  getDashboardStats = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getDashboardStats() });
    } catch (e) { next(e); }
  };

  getDiagnosisTrend = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getDiagnosisTrend() });
    } catch (e) { next(e); }
  };

  getDiseaseDistribution = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getDiseaseDistribution() });
    } catch (e) { next(e); }
  };

  getUserTrend = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getUserTrend() });
    } catch (e) { next(e); }
  };
}

module.exports = MonitoringController;
