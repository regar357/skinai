const router = require("router");
const encyclopediaController = require("../controllers/encyclopediaController");

// /api/diseases
router.get("/", encyclopediaController.getDiseases);
// /api/diseases/:diseases_id
router.get("/:diseases_id", encyclopediaController.getDiseases_id);
// /api/admin/diseases
router.post("/admin/diseases", encyclopediaController.createDiseases);
// /api/admin/diseases/:diseases_id
router.put("/admin/diseases", encyclopediaController.updateDiseases);
