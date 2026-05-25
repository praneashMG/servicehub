const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getBookingById, confirmBooking, declineBooking, updateBookingStatusByUser, updateBookingStatusByProvider, updateProviderLocation } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", getBookingById); // No protect to allow provider without auth for now
router.put("/:id/confirm", confirmBooking);
router.put("/:id/decline", declineBooking);
router.put("/:id/user-status", updateBookingStatusByUser);
router.put("/:id/provider-status", updateBookingStatusByProvider);
router.put("/:id/location", updateProviderLocation);

module.exports = router;
