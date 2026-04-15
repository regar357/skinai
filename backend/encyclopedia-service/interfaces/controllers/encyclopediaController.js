const encyclopediaService = require("../../application/encyclopediaService");

exports.getDiseases = async (req, res) => {
  try {
    const category = req.query.category || req.body.category || "";
    const keyword = req.query.keyword || req.body.keyword || "";
    const diseases = await encyclopediaService.listDiseases({
      category,
      keyword,
    });

    return res.status(200).json({
      success: true,
      message: "백과자료 조회 성공",
      data: diseases,
    });
  } catch (error) {
    console.error("getDiseases error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 백과자료를 조회할 수 없습니다.",
    });
  }
};

exports.getDiseaseById = async (req, res) => {
  try {
    const diseaseId = req.params.disease_id;
    if (!diseaseId) {
      return res.status(400).json({
        success: false,
        message: "자료 ID가 필요합니다.",
      });
    }

    const disease = await encyclopediaService.getDiseaseById(diseaseId);
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: "요청하신 백과사전 자료를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "백과자료 상세조회 성공",
      data: disease,
    });
  } catch (error) {
    console.error("getDiseaseById error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 백과자료 상세조회에 실패했습니다.",
    });
  }
};

exports.createDisease = async (req, res) => {
  try {
    const disease = await encyclopediaService.createDisease(req.body);
    return res.status(201).json({
      success: true,
      message: "백과자료 생성 성공",
      data: disease,
    });
  } catch (error) {
    console.error("createDisease error", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "서버 오류로 백과자료 생성에 실패했습니다.",
    });
  }
};

exports.updateDisease = async (req, res) => {
  try {
    const diseaseId = req.params.disease_id;
    if (!diseaseId) {
      return res.status(400).json({
        success: false,
        message: "자료 ID가 필요합니다.",
      });
    }

    const disease = await encyclopediaService.updateDisease(
      diseaseId,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "백과자료 수정 성공",
      data: disease,
    });
  } catch (error) {
    console.error("updateDisease error", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "서버 오류로 백과자료 수정에 실패했습니다.",
    });
  }
};
