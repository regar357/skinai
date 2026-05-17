class InternalAdminController {
  constructor(service) {
    this.service = service;
  }

  getUsers = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { status } = req.query;
      const result = await this.service.getUsers({ page, limit, status });
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  suspendUser = async (req, res, next) => {
    try {
      const data = await this.service.updateStatus(req.params.userId, "suspended");
      res.json({ success: true, data });
    } catch (e) { next(e); }
  };

  unsuspendUser = async (req, res, next) => {
    try {
      const data = await this.service.updateStatus(req.params.userId, "active");
      res.json({ success: true, data });
    } catch (e) { next(e); }
  };

  deleteUser = async (req, res, next) => {
    try {
      await this.service.updateStatus(req.params.userId, "inactive");
      res.json({ success: true });
    } catch (e) { next(e); }
  };
}

module.exports = InternalAdminController;
