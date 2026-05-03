function createDiagnosisController({ diagnosisService }) {
  return {
    async analyze(req, res, next) {
      try {
        const response = await diagnosisService.analyze({
          userId: getUserId(req),
          file: req.file,
        });
        res.status(201).json(response);
      } catch (error) {
        next(error);
      }
    },

    async history(req, res, next) {
      try {
        const response = await diagnosisService.history({
          userId: getUserId(req),
          page: req.body?.page,
          size: req.body?.size,
        });
        res.json(response);
      } catch (error) {
        next(error);
      }
    },

    async detail(req, res, next) {
      try {
        const response = await diagnosisService.detail({
          userId: getUserId(req),
          diagnosisId: req.params.id,
        });
        res.json(response);
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        await diagnosisService.remove({
          userId: getUserId(req),
          diagnosisId: req.params.id,
        });
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}

function getUserId(req) {
  return Number(req.header("x-user-id"));
}

module.exports = { createDiagnosisController };
