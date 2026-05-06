const noticeService = require("../../application/noticeService");

function sendResult(res, body, status = 200) {
  res.status(status).json({
    status,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

async function listNotices(req, res, next) {
  try {
    const result = await noticeService.getNotices(req.body || {});
    sendResult(res, result);
  } catch (error) {
    next(error);
  }
}

async function createNotice(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      const error = new Error("title과 content는 필수입니다.");
      error.status = 400;
      throw error;
    }
    const result = await noticeService.createNotice({ title, content });
    sendResult(res, result, 201);
  } catch (error) {
    next(error);
  }
}

async function updateNotice(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      const error = new Error("title과 content는 필수입니다.");
      error.status = 400;
      throw error;
    }
    const result = await noticeService.updateNotice(id, { title, content });
    sendResult(res, result);
  } catch (error) {
    next(error);
  }
}

async function deleteNotice(req, res, next) {
  try {
    const { id } = req.params;
    const result = await noticeService.deleteNotice(id);
    sendResult(res, result);
  } catch (error) {
    next(error);
  }
}

module.exports = { listNotices, createNotice, updateNotice, deleteNotice };
