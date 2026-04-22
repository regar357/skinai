const pool = require("../infrastructure/db/mysql");
const { Article } = require("../domain/Article");

exports.listArticles = async ({ page, limit, category, search }) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Math.min(Number(limit) || 10, 100), 1);
  const offset = (normalizedPage - 1) * normalizedLimit;

  const conditions = ["is_active = TRUE"];
  const params = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("(title LIKE ? OR content LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const [rows] = await pool.execute(
    `
      SELECT article_id, title, content, category, icon, icon_bg, icon_color, created_at, updated_at
      FROM encyclopedia_articles
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
    [...params, normalizedLimit, offset],
  );

  const [countRows] = await pool.execute(
    `
      SELECT COUNT(*) AS totalItems
      FROM encyclopedia_articles
      ${whereClause}
    `,
    params,
  );

  const totalItems = countRows[0].totalItems;

  return {
    items: rows.map((row) => Article.fromRow(row).toListItem()),
    pagination: {
      currentPage: normalizedPage,
      totalPages: Math.max(Math.ceil(totalItems / normalizedLimit), 1),
      totalItems,
      itemsPerPage: normalizedLimit,
    },
  };
};

exports.getArticleById = async (articleId) => {
  const [rows] = await pool.execute(
    `
      SELECT article_id, title, content, category, icon, icon_bg, icon_color, related_articles, created_at, updated_at
      FROM encyclopedia_articles
      WHERE article_id = ? AND is_active = TRUE
      LIMIT 1
    `,
    [articleId],
  );

  if (!rows[0]) {
    return null;
  }

  return Article.fromRow(rows[0]).toDetail();
};
