const express = require("express");
const router = express.Router();
const { getMyProfile, updateProfile , getUserProfile } = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

 
router.get("/me", protect, getMyProfile);
router.get("/user/:userId", protect, getUserProfile);

 
router.put("/update", protect, updateProfile);

module.exports = router;
