const express = require("express");
const router = express.Router();
const { getDashboardStats, getAssignedBookings, updateBookingStatus } = require("../controllers/providerController");
const { protect } = require("../middleware/authMiddleware");

// Should ideally add an isAdminOrProvider middleware, but for now we just protect
router.get("/stats", protect, getDashboardStats);
router.get("/bookings", protect, getAssignedBookings);
router.put("/bookings/:id", protect, updateBookingStatus);

module.exports = router;
