const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  toggleLike,
  addComment,
  getPostById
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/create", protect, upload.array("media",5),createPost);
router.get("/", protect, getAllPosts);
router.get("/:id", protect, getPostById);  
router.get("/user/:userId", protect, getUserPosts);
router.put("/like/:id", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

module.exports = router;
