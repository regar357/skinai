function buildEncyclopediaResponse(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
  };
}

module.exports = { buildEncyclopediaResponse };
