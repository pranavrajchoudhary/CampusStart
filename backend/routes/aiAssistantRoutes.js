const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiAssistantController");
const { protect } = require("../middlewares/authMiddleware"); // Your auth middleware

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI about a specific idea
 * @access  Private
 * @body    { ideaId: String, query: String }
 */
router.post("/chat", aiController.chatWithIdea);

/**
 * @route   GET /api/ai/conversation/:ideaId
 * @desc    Get conversation history for an idea
 * @access  Private
 */
router.get("/conversation/:ideaId", aiController.getConversation);

/**
 * @route   DELETE /api/ai/conversation/:ideaId
 * @desc    Clear conversation history
 * @access  Private
 */
router.delete("/conversation/:ideaId", aiController.clearConversation);

/**
 * @route   GET /api/ai/conversations
 * @desc    Get all user conversations
 * @access  Private
 */
router.get("/conversations", aiController.getUserConversations);

module.exports = router;