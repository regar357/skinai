const encyclopediaService = require("../../application/encyclopediaService");

function sendResult(res, body, status = 200) {
  res.status(status).json({
    status,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

async function listItems(req, res, next) {
  try {
    const result = await encyclopediaService.getItems(req.body || {});
    sendResult(res, result);
  } catch (error) {
    next(error);
  }
}

async function createItem(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      const error = new Error("title과 content는 필수입니다.");
      error.status = 400;
      throw error;
    }
    const result = await encyclopediaService.createItem({ title, content });
    sendResult(res, result, 201);
  } catch (error) {
    next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      const error = new Error("title과 content는 필수입니다.");
      error.status = 400;
      throw error;
    }
    const result = await encyclopediaService.updateItem(id, { title, content });
    sendResult(res, result);
  } catch (error) {
    next(error);
  }
}

async function deleteItem(req, res, next) {
  try {
    const { id } = req.params;
    const result = await encyclopediaService.deleteItem(id);
    sendResult(res, result);
  } catch (error) {
    next(error);
  }
}

module.exports = { listItems, createItem, updateItem, deleteItem };
