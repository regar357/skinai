const { createAnalysis } = require("../../application/services/analysis/createAnalysisService");
const { deleteAnalysis } = require("../../application/services/analysis/deleteAnalysisService");
const { getAnalysisDetail } = require("../../application/services/analysis/getAnalysisDetailService");
const { getAnalysisList } = require("../../application/services/analysis/getAnalysisListService");

async function createAnalysisHandler(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Image file is required.",
        },
      });
    }

    const { gender, age } = req.body;
    const parsedAge = Number(age);

    if (!gender || !age) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "gender and age are required.",
        },
      });
    }

    if (!["male", "female"].includes(String(gender).toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "gender must be either male or female.",
        },
      });
    }

    if (!Number.isFinite(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "age must be a positive number.",
        },
      });
    }

    const analysis = await createAnalysis({
      file: req.file,
      userId: req.user.id,
      gender: String(gender).toLowerCase(),
      age: parsedAge,
    });

    return res.status(201).json({
      success: true,
      data: analysis,
      message: "Analysis completed",
    });
  } catch (error) {
    return next(error);
  }
}

async function getAnalysisListHandler(req, res, next) {
  try {
    const result = await getAnalysisList({
      userId: req.user.id,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      order: req.query.order,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAnalysisDetailHandler(req, res, next) {
  try {
    const result = await getAnalysisDetail({
      analysisId: req.params.id,
      userId: req.user.id,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteAnalysisHandler(req, res, next) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ids must be an array.",
        },
      });
    }

    const result = await deleteAnalysis({
      analysisIds: ids,
      userId: req.user.id,
    });

    return res.json({
      success: true,
      message: "Records deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createAnalysisHandler,
  getAnalysisListHandler,
  getAnalysisDetailHandler,
  deleteAnalysisHandler,
};
