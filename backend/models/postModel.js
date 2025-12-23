const mongoose = require("mongoose");
const { Schema } = mongoose;

 

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Important for populate
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    content: String,
    image: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [commentSchema],
    likes: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User",
  default: [], // 🔥 THIS FIXES 80% PROBLEMS
},

  },
  { timestamps: true }
);

 

module.exports = mongoose.model("Post", postSchema);
