const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  toggleLike,
  addComment,
  getPostById,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// 🔴 ORDER MATTERS – specific routes FIRST
router.post("/create", protect, upload.array("media", 5), createPost);

// ✅ USER POSTS (LinkedIn-style profile feed)
router.get("/user/:userId", protect, getUserPosts);

// ✅ GLOBAL FEED
router.get("/", protect, getAllPosts);

// ✅ SINGLE POST (detail view)
router.get("/:id", protect, getPostById);

router.put("/like/:id", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

module.exports = router;
