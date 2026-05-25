const express = require("express");
const router = express.Router();
const { 
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateWallet,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAllTransactions,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getPendingPayments,
  verifyPayment
} = require("../controllers/adminController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// All routes require authentication AND admin role
router.use(protect, adminProtect);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/wallet", updateWallet);

// Bookings
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);
router.delete("/bookings/:id", deleteBooking);

// Services
router.get("/services", getAllServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Transactions & Payments
router.get("/transactions", getAllTransactions);
router.get("/payments/pending", getPendingPayments);
router.put("/payments/:id/verify", verifyPayment);

module.exports = router;
