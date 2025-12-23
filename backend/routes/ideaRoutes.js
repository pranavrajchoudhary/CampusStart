const express = require("express");
const router = express.Router();
const Idea = require("../models/ideaModel");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, async (req, res) => {
  try {
    console.log("REQ USER:", req.user);   // 🔥 ADD THIS
    console.log("REQ BODY:", req.body);

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const idea = await Idea.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({ idea });
  } catch (err) {
    console.error("IDEA CREATE ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ message: err.message });
  }
});

/// prompt -> APi -> reply -> send to fromtemd



module.exports = router;
