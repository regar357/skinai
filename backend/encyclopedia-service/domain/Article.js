function toIsoDateTime(value) {
  return value ? new Date(value).toISOString() : null;
}

function parseRelatedArticles(value) {
  try {
    return typeof value === "string" ? JSON.parse(value) : value ?? [];
  } catch (error) {
    return [];
  }
}

class Article {
  constructor({
    article_id,
    title,
    content,
    category,
    icon,
    icon_bg,
    icon_color,
    related_articles,
    is_active,
    created_at,
    updated_at,
  }) {
    this.article_id = article_id;
    this.title = title;
    this.content = content;
    this.category = category;
    this.icon = icon;
    this.icon_bg = icon_bg;
    this.icon_color = icon_color;
    this.related_articles = related_articles;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromRow(row) {
    return new Article(row);
  }

  toListItem() {
    return {
      id: String(this.article_id),
      title: this.title,
      content: this.content,
      category: this.category,
      icon: this.icon,
      iconBg: this.icon_bg,
      iconColor: this.icon_color,
      createdAt: toIsoDateTime(this.created_at),
      updatedAt: toIsoDateTime(this.updated_at),
    };
  }

  toDetail() {
    return {
      id: String(this.article_id),
      title: this.title,
      content: this.content,
      category: this.category,
      icon: this.icon,
      iconBg: this.icon_bg,
      iconColor: this.icon_color,
      relatedArticles: parseRelatedArticles(this.related_articles).map(String),
      createdAt: toIsoDateTime(this.created_at),
      updatedAt: toIsoDateTime(this.updated_at),
    };
  }
}

module.exports = { Article };
