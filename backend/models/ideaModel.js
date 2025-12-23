const mongoose = require("mongoose");
const { Schema } = mongoose;

const ideaSchema = new Schema({
  title: String,
  description: String,
  domain: [String],
  requiredSkills: [String],
  rolesNeeded: [String],
  teamSize: { type: Number, default: 3 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Idea", ideaSchema);
