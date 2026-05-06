function formatDate(date) {
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function buildNoticeResponse(row) {
  const createdAt =
    row.created_at instanceof Date ? row.created_at : new Date(row.created_at);

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: createdAt.toISOString(),
    date: formatDate(createdAt),
  };
}

module.exports = { buildNoticeResponse };
