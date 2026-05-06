const noticeRepository = require("../infrastructure/repository/noticeRepository");
const { buildNoticeResponse } = require("../domain/noticeEntity");

function normalizePageSize(page, size) {
  const currentPage = Number(page) > 0 ? Math.floor(Number(page)) : 1;
  const pageSize = Number(size) > 0 ? Math.floor(Number(size)) : 10;
  return { page: currentPage, size: pageSize };
}

class NoticeService {
  async getNotices({ page, size }) {
    const pagination = normalizePageSize(page, size);
    const { items, total } = await noticeRepository.findAll(pagination);

    const formattedItems = items.map(buildNoticeResponse);
    const totalPages = Math.max(1, Math.ceil(total / pagination.size));

    return {
      items: formattedItems,
      pagination: {
        currentPage: pagination.page,
        totalPages,
        totalItems: total,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async createNotice({ title, content }) {
    const insertId = await noticeRepository.create({ title, content });
    const created = await noticeRepository.findById(insertId);
    return buildNoticeResponse(created);
  }

  async updateNotice(id, { title, content }) {
    const updated = await noticeRepository.update(id, { title, content });
    if (!updated) {
      const error = new Error("공지사항을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }
    const notice = await noticeRepository.findById(id);
    return buildNoticeResponse(notice);
  }

  async deleteNotice(id) {
    const deleted = await noticeRepository.delete(id);
    if (!deleted) {
      const error = new Error("공지사항을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }
    return { message: "삭제가 완료되었습니다." };
  }
}

module.exports = new NoticeService();
