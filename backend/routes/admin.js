const router = require("router");
const adminController = require("../controllers/adminController");

// /api/admin/login
router.post("/login", adminController.adminLogin);
// /api/admin/logout
router.post("/logout", adminController.adminLogout);
