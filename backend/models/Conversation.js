const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new Schema({
  ideaId: { type: Schema.Types.ObjectId, ref: "Idea", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messages: [messageSchema],
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
conversationSchema.index({ ideaId: 1, userId: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);