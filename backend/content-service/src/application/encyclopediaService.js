const encyclopediaRepository = require("../infrastructure/repository/encyclopediaRepository");
const { buildEncyclopediaResponse } = require("../domain/encyclopediaEntity");

function normalizePageSize(page, size) {
  const currentPage = Number(page) > 0 ? Math.floor(Number(page)) : 1;
  const pageSize = Number(size) > 0 ? Math.floor(Number(size)) : 10;
  return { page: currentPage, size: pageSize };
}

class EncyclopediaService {
  async getItems({ query, page, size }) {
    const pagination = normalizePageSize(page, size);
    const { items, total } = await encyclopediaRepository.findAll({
      query: query || "",
      page: pagination.page,
      size: pagination.size,
    });

    const formattedItems = items.map(buildEncyclopediaResponse);
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

  async createItem({ title, content }) {
    const insertId = await encyclopediaRepository.create({ title, content });
    const created = await encyclopediaRepository.findById(insertId);
    return buildEncyclopediaResponse(created);
  }

  async updateItem(id, { title, content }) {
    const updated = await encyclopediaRepository.update(id, { title, content });
    if (!updated) {
      const error = new Error("피부백과 항목을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }
    const item = await encyclopediaRepository.findById(id);
    return buildEncyclopediaResponse(item);
  }

  async deleteItem(id) {
    const deleted = await encyclopediaRepository.delete(id);
    if (!deleted) {
      const error = new Error("피부백과 항목을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }
    return { message: "삭제가 완료되었습니다." };
  }
}

module.exports = new EncyclopediaService();
