const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

// Protected route to get stats
router.get("/", protect, getDashboardStats);

module.exports = router;
