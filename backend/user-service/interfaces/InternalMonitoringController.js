class InternalMonitoringController {
  constructor(service) {
    this.service = service;
  }

  getUserDashboardStats = async (req, res, next) => {
    try {
      res.json({ success: true, data: await this.service.getUserDashboardStats() });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = InternalMonitoringController;
