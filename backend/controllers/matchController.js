const axios = require("axios");
const User = require("../models/User");
const Idea = require("../models/ideaModel");

const matchTeam = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // ✅ FIX 4: idea not found
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

const candidates = await User.find({
  $or: [
    { role: { $in: idea.rolesNeeded } },
    { skills: { $in: idea.requiredSkills } }
  ]
});


    // ✅ FIX 5: no candidates
    if (candidates.length === 0) {
      return res.json([]);
    }

    const payload = {
      ideaText: `
        ${idea.title}
        ${idea.description}
        ${idea.requiredSkills.join(" ")}
        ${idea.domain.join(" ")}
      `,
      users: candidates.map(u => ({
        userId: u._id.toString(),
        // ✅ FIX 6: fallback if missing
        text: u.matchProfileText || ""
      }))
    };

    let mlResponse;
    try {
      mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/match`, payload);
    } catch (err) {
      // ✅ FIX 7: ML service down
      return res.status(503).json({ message: "ML service unavailable" });
    }

    const TOP_N = 10;
    const topMatches = mlResponse.data.slice(0, TOP_N);
    const userIds = topMatches.map(m => m.userId);

    const users = await User.find({ _id: { $in: userIds } })
      .select("username profileName skills role dp headline instituteName");

    // ✅ FIX 8: safe merge
    const finalResult = topMatches
      .map(match => {
        const user = users.find(u => u._id.toString() === match.userId);
        if (!user) return null;
        return { ...user.toObject(), matchScore: match.score };
      })
      .filter(Boolean);

    res.json(finalResult);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Matchmaking failed" });
  }
};

module.exports = { matchTeam };
