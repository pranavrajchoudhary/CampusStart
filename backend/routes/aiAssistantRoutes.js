const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiAssistantController");
const { protect } = require("../middlewares/authMiddleware");  

 
router.use(protect);
 
router.post("/chat", aiController.chatWithIdea);

 
router.get("/conversation/:ideaId", aiController.getConversation);
 
router.delete("/conversation/:ideaId", aiController.clearConversation);

 
router.get("/conversations", aiController.getUserConversations);

module.exports = router;
