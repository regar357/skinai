class InternalMonitoringController {
  constructor(service) {
    this.service = service;
  }

  getPerformance = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getPerformance() });
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

  getDailySummary = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getDailySummary() });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = InternalMonitoringController;
