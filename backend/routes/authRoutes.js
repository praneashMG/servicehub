const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  changePassword, 
  updateProfile,
  requestAccountDeletion, 
  confirmAccountDeletion 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/password", protect, changePassword);
router.put("/profile", protect, updateProfile);
router.post("/delete-request", protect, requestAccountDeletion);
router.post("/delete-confirm", protect, confirmAccountDeletion);

module.exports = router;