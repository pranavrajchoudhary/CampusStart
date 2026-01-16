const express = require("express");
const router = express.Router();
const { matchTeam } = require("../controllers/matchController");
const { protect } = require("../middlewares/authMiddleware");
 
router.get("/idea/:id", protect, matchTeam);

module.exports = router;
