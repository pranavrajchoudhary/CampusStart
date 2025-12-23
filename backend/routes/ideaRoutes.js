const express = require("express");
const router = express.Router();
const Idea = require("../models/ideaModel");
const { protect } = require("../middlewares/authMiddleware");

// CREATE IDEA (already there)
router.post("/", protect, async (req, res) => {
  try {
    const idea = await Idea.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ idea });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET MY IDEAS
router.get("/my", protect, async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ ideas });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ideas" });
  }
});

module.exports = router;
