const encyclopediaService = require("../../application/encyclopediaService");

exports.getArticles = async (req, res) => {
  try {
    const result = await encyclopediaService.listArticles({
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      search: req.query.search,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getArticles error", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve encyclopedia articles.",
      },
    });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await encyclopediaService.getArticleById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Encyclopedia article not found.",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("getArticleById error", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve encyclopedia article details.",
      },
    });
  }
};
