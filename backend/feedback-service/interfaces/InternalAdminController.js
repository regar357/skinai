class InternalAdminController {
  constructor(service) {
    this.service = service;
  }

  getFeedbacks = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.service.getFeedbacks({ page, limit });
      res.json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  replyFeedback = async (req, res, next) => {
    try {
      const replyText = req.body.reply_text || req.body.replyText;
      if (!replyText) {
        return res.status(400).json({ success: false, message: "답변 내용이 필요합니다." });
      }
      const data = await this.service.replyFeedback(req.params.feedbackId, replyText);
      res.json({ success: true, data });
    } catch (e) { next(e); }
  };
}

module.exports = InternalAdminController;
