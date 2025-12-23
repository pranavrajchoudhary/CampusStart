const Post = require("../models/postModel");
const User = require("../models/User");

// ✅ Create a new post
exports.createPost = async (req, res) => {
  try {
    const files = req.files || [];
    const media = files.map(file => ({
      type: file.mimetype.startsWith("video") ? "video" : "image",
      url: file.path,
    }));

    const { content, category } = req.body;

    const newPost = await Post.create({
      author: req.user.id,
      content,
      media,
      category,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: "Server error while creating post" });
  }
};

// controllers/postController.js
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username dp")
      .populate("comments.user", "username dp")
      .lean() // 👈 VERY IMPORTANT
      .sort({ createdAt: -1 });

    // normalize likes always as strings
    const normalized = posts.map((p) => ({
      ...p,
      likes: Array.isArray(p.likes)
        ? p.likes.map((id) => id.toString())
        : [],
    }));

    res.status(200).json({ success: true, posts: normalized });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ Get posts by a specific user
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId })
      .populate("author", "username profileName dp")
      .populate("comments.user", "username profileName dp")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching user posts" });
  }
};
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id.toString();

    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // 🔥 Ensure likes always exists
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("author", "username profileName dp")
      .populate("comments.user", "username profileName dp")
      .lean();

    res.status(200).json({
      success: true,
      post: {
        ...updated,
        likes: Array.isArray(updated.likes)
          ? updated.likes.map((id) => id.toString())
          : [],
      },
    });

  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like" });
  }
};




exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user.id,
      text: req.body.text,
    });

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("author", "username profileName dp")
      .populate("comments.user", "username profileName dp");

    res.status(200).json({ success: true, comments: updated.comments, post: updated });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profileName dp")
      .populate("comments.user", "username profileName dp");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error("Error getting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};