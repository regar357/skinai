class InternalAdminController {
  constructor(service) {
    this.service = service;
  }

  getExamRecords = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { search } = req.query;
      const result = await this.service.getExamRecords({ page, limit, search });
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  getImageInfo = async (req, res, next) => {
    try {
      const data = await this.service.getImageInfo(req.params.imageId);
      if (!data) return res.status(404).json({ success: false, message: "이미지를 찾을 수 없습니다." });
      res.json({ success: true, data });
    } catch (e) { next(e); }
  };
}

module.exports = InternalAdminController;
