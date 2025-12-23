const Idea = require("../models/ideaModel");
const Conversation = require("../models/Conversation");
const geminiService = require("../services/geminiService");


exports.chatWithIdea = async (req, res) => {
  try {
    const { ideaId, query } = req.body;
    const userId = req.user._id; 
    if (!ideaId || !query?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "ideaId and query are required" 
      });
    }

    // 1. Fetch the idea
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ 
        success: false, 
        message: "Idea not found" 
      });
    }

    // 2. Get or create conversation
    let conversation = await Conversation.findOne({ ideaId, userId });
    
    if (!conversation) {
      conversation = new Conversation({
        ideaId,
        userId,
        messages: []
      });
    }

    // 3. Get AI response
    const aiResponse = await geminiService.askGemini(
      idea,
      conversation.messages,
      query
    );

    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: aiResponse.error
      });
    }

    // 4. Save conversation
    conversation.messages.push(
      { role: "user", content: query },
      { role: "assistant", content: aiResponse.message }
    );
    conversation.lastActive = new Date();
    await conversation.save();

    // 5. Return response
    res.json({
      success: true,
      data: {
        response: aiResponse.message,
        conversationId: conversation._id,
        messageCount: conversation.messages.length
      }
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

/**
 * Get conversation history for an idea
 * GET /api/ai/conversation/:ideaId
 */
exports.getConversation = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({ ideaId, userId })
      .populate("ideaId", "title description");

    if (!conversation) {
      return res.json({
        success: true,
        data: {
          messages: [],
          idea: await Idea.findById(ideaId, "title description")
        }
      });
    }

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        messages: conversation.messages,
        idea: conversation.ideaId,
        lastActive: conversation.lastActive
      }
    });

  } catch (error) {
    console.error("Get Conversation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

/**
 * Clear conversation history
 * DELETE /api/ai/conversation/:ideaId
 */
exports.clearConversation = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;

    await Conversation.deleteOne({ ideaId, userId });

    res.json({
      success: true,
      message: "Conversation cleared"
    });

  } catch (error) {
    console.error("Clear Conversation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

/**
 * Get all user conversations
 * GET /api/ai/conversations
 */
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ userId })
      .populate("ideaId", "title domain")
      .sort({ lastActive: -1 })
      .limit(20);

    res.json({
      success: true,
      data: conversations.map(conv => ({
        conversationId: conv._id,
        idea: conv.ideaId,
        messageCount: conv.messages.length,
        lastActive: conv.lastActive
      }))
    });

  } catch (error) {
    console.error("Get User Conversations Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};