const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, getHistory, manualPayment, getPaymentByBookingId, verifyManualPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/history", protect, getHistory);
router.post("/manual", protect, manualPayment);
router.get("/booking/:bookingId", getPaymentByBookingId); // public for provider for now
router.put("/:id/verify-manual", verifyManualPayment); // public for provider for now

module.exports = router;
